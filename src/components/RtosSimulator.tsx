import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, ShieldAlert, Zap, Lock, Unlock, Play, Square, Activity, 
  Settings, RefreshCw, AlertTriangle, FileVideo, ExternalLink, 
  Terminal, DollarSign, Volume2, VolumeX, AlertCircle, Heart 
} from 'lucide-react';
import { RtosTask } from '../types';
import ProjectBreakdown from './ProjectBreakdown';

const RTOS_TASKS: RtosTask[] = [
  { name: 'AppTaskEmergency', priority: 2, trigger: 'ISR (Semaphore)', responsibility: 'Highest-priority safety shutdown & interlock' },
  { name: 'AppTaskServo', priority: 3, trigger: 'Semaphore', responsibility: 'Fail-secure mechanical safety door lock control' },
  { name: 'AppTaskButton', priority: 4, trigger: 'Periodic (50ms)', responsibility: 'Reliable user inputs & mechanical debounce states' },
  { name: 'AppTaskSensor', priority: 5, trigger: 'Periodic (20ms)', responsibility: 'I2C-based fast vibration acquisition (ADXL345)' },
  { name: 'AppTaskControl', priority: 6, trigger: 'Event-driven', responsibility: 'Safety Finite State Machine (FSM) orchestration' },
  { name: 'AppTaskConveyorA', priority: 8, trigger: 'Periodic (100ms)', responsibility: 'Conveyor A speed, PWM, and status monitoring' },
  { name: 'AppTaskConveyorB', priority: 9, trigger: 'Periodic (100ms)', responsibility: 'Conveyor B speed, PWM, and status monitoring' },
  { name: 'AppTaskUltrasonic', priority: 11, trigger: 'Periodic (150ms)', responsibility: 'Human proximity safety distance detection (HC-SR04)' },
  { name: 'AppTaskMaintenance', priority: 12, trigger: 'Periodic (1s)', responsibility: 'Machine health diagnostics & economic cost logging' },
];

const MAINTENANCE_LEVELS = [
  { level: 1, name: "Level 1: Inspection", cost: 50, healthGain: 10, downtime: 3 },
  { level: 2, name: "Level 2: Minor Repair", cost: 120, healthGain: 20, downtime: 5 },
  { level: 3, name: "Level 3: Standard Service", cost: 220, healthGain: 35, downtime: 7 },
  { level: 4, name: "Level 4: Major Repair", cost: 350, healthGain: 55, downtime: 10 },
  { level: 5, name: "Level 5: Full Overhaul", cost: 500, healthGain: 80, downtime: 15 }
];

export default function RtosSimulator() {
  // STM32 System States
  const [systemRun, setSystemRun] = useState<boolean>(false);
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);
  const [maintenanceInProgress, setMaintenanceInProgress] = useState<boolean>(false);
  const [maintCountdown, setMaintCountdown] = useState<number>(0);
  const [doorHoldClosedUntilStart, setDoorHoldClosedUntilStart] = useState<boolean>(false);
  const [servoHardLock, setServoHardLock] = useState<boolean>(false);
  const [machineHealth, setMachineHealth] = useState<number>(100);
  const [normalWearCounter, setNormalWearCounter] = useState<number>(0);

  // Factory economy
  const [productCountA, setProductCountA] = useState<number>(0);
  const [productCountB, setProductCountB] = useState<number>(0);
  const [productProgressA, setProductProgressA] = useState<number>(0);
  const [productProgressB, setProductProgressB] = useState<number>(0);
  const [totalMaintenanceCost, setTotalMaintenanceCost] = useState<number>(0);
  const [factoryRunTimeSec, setFactoryRunTimeSec] = useState<number>(0);

  // Sensors raw stimuli
  const [vibrationVal, setVibrationVal] = useState<number>(32); // 0 to 500
  const [proximityCm, setProximityCm] = useState<number>(120); // 2 to 200
  const [potAdcRaw, setPotAdcRaw] = useState<number>(1024); // 0 to 4095

  // Processed system states (hysteresis)
  const [vibStateA, setVibStateA] = useState<'NORMAL' | 'WARNING' | 'RECOVERY' | 'DANGER' | 'EMERGENCY'>('NORMAL');
  const [vibStateB, setVibStateB] = useState<'NORMAL' | 'WARNING' | 'RECOVERY' | 'DANGER' | 'EMERGENCY'>('NORMAL');
  const [overallState, setOverallState] = useState<'NORMAL' | 'WARNING' | 'RECOVERY' | 'DANGER' | 'EMERGENCY'>('NORMAL');
  const [personState, setPersonState] = useState<'NONE' | 'WARN' | 'NEAR'>('NONE');
  const [doorState, setDoorState] = useState<'OPEN' | 'HALF' | 'CLOSED' | 'LOCKED'>('OPEN');
  const [servoAngle, setServoAngle] = useState<number>(0); // 0, 45, 90

  // Selected level from Pot
  const [selectedMaintLevel, setSelectedMaintLevel] = useState<number>(2);

  // Active beep toggle for visual soundwaves
  const [buzzerActive, setBuzzerActive] = useState<boolean>(false);

  // Log buffers
  const [logTrace, setLogTrace] = useState<string[]>([
    '[OS_INIT] uC/OS-III kernel initialized successfully.',
    '[TASK_CREATE] Spawned 9 concurrent application tasks.',
    '[SYSTEM_READY] Dual-conveyor system standing by in State: NORMAL'
  ]);

  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    '==================================================',
    ' Dual Conveyor RTOS Factory Safety Simulation v15',
    ' + Unified ForceServo90Deg Structural Bottleneck',
    ' + HC-SR04 Person Detection (PA2=TRIG, PA3=ECHO)',
    ' + SG90 Servo Door (PA0 / TIM5 CH1)',
    ' + Potentiometer Maintenance Selector (PA4 / ADC1 CH4)',
    ' SERVO: OPEN=0deg  HALF=45deg  CLOSED/STOP=90deg',
    ' STOP CONDITIONS -> servo physically reaches 90 deg FIRST:',
    '   1) Emergency button (PC1)',
    '   2) Object detected <= 8 cm (HC-SR04)',
    '   3) \'stop\' command or pause button',
    '   4) MachineHealth = 0',
    ' Restart: servo physically opens to 0 deg BEFORE conveyors start.',
    ' Person: >=45cm=NONE  9-44cm=WARN  <=8cm=EMERGENCY',
    ' Commands: start stop status count ultra pot maint money clear help',
    '==================================================',
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'simulator' | 'tasks'>('simulator');
  const logContainerRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll trace logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logTrace]);

  // Auto-scroll terminal history
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogTrace((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  // Convert states to step delay milliseconds for production
  const getDelayMs = (state: string) => {
    switch (state) {
      case 'NORMAL': return 350;
      case 'WARNING': return 250;
      case 'RECOVERY': return 500;
      case 'DANGER': return 120;
      default: return 500;
    }
  };

  // State machine transition for ADXL345 Vibration (Hysteresis)
  const getNextVibState = (current: string, val: number) => {
    if (current === 'NORMAL') {
      if (val >= 35) return 'WARNING';
    } else if (current === 'WARNING') {
      if (val >= 120) return 'DANGER';
      else if (val < 20) return 'RECOVERY';
    } else if (current === 'RECOVERY') {
      if (val >= 120) return 'DANGER';
      else if (val >= 35) return 'WARNING';
      else if (val < 20) return 'NORMAL';
    } else if (current === 'DANGER') {
      if (val < 70) return 'RECOVERY';
    }
    return current as 'NORMAL' | 'WARNING' | 'RECOVERY' | 'DANGER' | 'EMERGENCY';
  };

  // 1. Process Raw Vibration & Proximity States whenever input sliders change
  useEffect(() => {
    if (emergencyActive) return;

    // Simulate VibA and VibB based on main slider with slight jitter
    const vibA = vibrationVal;
    const vibB = Math.max(0, vibrationVal + Math.floor(Math.sin(Date.now() / 300) * 6));

    // Check extreme emergency levels >= 380 g/raw instantly
    if (vibA >= 380 || vibB >= 380) {
      triggerEmergencyStop('Severe Vibration Alert (>380g)');
      return;
    }

    // Standard state machine updates
    const nextA = getNextVibState(vibStateA, vibA);
    const nextB = getNextVibState(vibStateB, vibB);

    if (nextA !== vibStateA) setVibStateA(nextA);
    if (nextB !== vibStateB) setVibStateB(nextB);

    // Compute overall vibration state
    const statePriority = { NORMAL: 0, RECOVERY: 1, WARNING: 2, DANGER: 3, EMERGENCY: 4 };
    let nextOverall = statePriority[nextA] > statePriority[nextB] ? nextA : nextB;

    // Person distance sensor state map
    let nextPersonState: 'NONE' | 'WARN' | 'NEAR' = 'NONE';
    if (proximityCm <= 8) {
      nextPersonState = 'NEAR';
      if (!maintenanceInProgress) {
        triggerEmergencyStop('Person Obstruction <= 8cm');
        return;
      }
    } else if (proximityCm <= 44) {
      nextPersonState = 'WARN';
    }

    setPersonState(nextPersonState);

    // Person WARN state forces overall to at least WARNING
    if (nextPersonState === 'WARN' && statePriority[nextOverall] < statePriority['WARNING']) {
      nextOverall = 'WARNING';
    }

    if (nextOverall !== overallState) {
      setOverallState(nextOverall);
      addLog(`[STATE] Overall vibration/safety state transitioned to: ${nextOverall}`);
      setTerminalHistory(prev => [...prev, `[STATE] Transitioned to: ${nextOverall} (A:${nextA}, B:${nextB}, Person:${nextPersonState})`]);
    }
  }, [vibrationVal, proximityCm, emergencyActive]);

  // 2. Map Potentiometer ADC (0 to 4095) to Maintenance Level (1 to 5)
  useEffect(() => {
    const level = Math.min(5, Math.max(1, Math.floor((potAdcRaw * 5) / 4096) + 1));
    setSelectedMaintLevel(level);
  }, [potAdcRaw]);

  // 3. Centralized Actuator Gate Logic (deciding servo angle & door state)
  useEffect(() => {
    if (emergencyActive || overallState === 'EMERGENCY' || personState === 'NEAR') {
      setDoorState('LOCKED');
      setServoAngle(90);
    } else if (maintenanceInProgress || doorHoldClosedUntilStart) {
      setDoorState('LOCKED');
      setServoAngle(90);
    } else if (!systemRun) {
      setDoorState('LOCKED');
      setServoAngle(90);
    } else if (overallState === 'DANGER' || (personState === 'WARN' && overallState === 'DANGER')) {
      setDoorState('CLOSED');
      setServoAngle(90);
    } else if (overallState === 'WARNING' || personState === 'WARN') {
      setDoorState('HALF');
      setServoAngle(45);
    } else {
      setDoorState('OPEN');
      setServoAngle(0);
    }
  }, [overallState, personState, systemRun, emergencyActive, maintenanceInProgress, doorHoldClosedUntilStart]);

  // 4. Central Real-time Task Scheduler & Factory Economy Interval (1000ms ticks)
  useEffect(() => {
    const interval = setInterval(() => {
      if (systemRun && !emergencyActive && !maintenanceInProgress) {
        // Run time ticks
        setFactoryRunTimeSec(prev => prev + 1);

        // Product processing speed per second
        const rateA = 1000 / getDelayMs(vibStateA);
        const rateB = 1000 / getDelayMs(vibStateB);

        // Progress accrual
        setProductProgressA(prev => {
          const next = prev + rateA;
          if (next >= 1) {
            const count = Math.floor(next);
            setProductCountA(c => c + count);
            addLog(`[TASK_CONVEYOR_A] Sensed completed product. Belt A Count: ${productCountA + count}`);
            return next - count;
          }
          return next;
        });

        setProductProgressB(prev => {
          const next = prev + rateB;
          if (next >= 1) {
            const count = Math.floor(next);
            setProductCountB(c => c + count);
            addLog(`[TASK_CONVEYOR_B] Sensed completed product. Belt B Count: ${productCountB + count}`);
            return next - count;
          }
          return next;
        });

        // Machine wear / Health degradation
        let wear = 0;
        if (overallState === 'DANGER') {
          wear = 3;
        } else if (overallState === 'WARNING' || overallState === 'RECOVERY' || personState === 'WARN') {
          wear = 1;
        } else {
          // Normal wear: -1 health every 10 seconds
          setNormalWearCounter(prev => {
            const next = prev + 1;
            if (next >= 10) {
              setMachineHealth(h => {
                const updated = Math.max(0, h - 1);
                if (h > 70 && updated <= 70) {
                  setTerminalHistory(t => [...t, `[MAINT] MachineHealth <= 70. Maintenance is now allowed.`]);
                  addLog('[MAINT] Health alert! MachineHealth dropped to 70%. Maintenance allowed.');
                }
                if (updated === 0) {
                  triggerEmergencyStop('Machine Integrity Failure (0% Health)');
                }
                return updated;
              });
              return 0;
            }
            return next;
          });
        }

        if (wear > 0) {
          setMachineHealth(h => {
            const updated = Math.max(0, h - wear);
            if (h > 70 && updated <= 70) {
              setTerminalHistory(t => [...t, `[MAINT] MachineHealth <= 70. Maintenance is now allowed.`]);
              addLog('[MAINT] Health alert! MachineHealth dropped to 70%. Maintenance allowed.');
            }
            if (updated === 0) {
              triggerEmergencyStop('Machine Integrity Failure (0% Health)');
            }
            return updated;
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [systemRun, emergencyActive, maintenanceInProgress, vibStateA, vibStateB, overallState, personState, productCountA, productCountB]);

  // 5. Periodic Active Preemptive Logs to simulate background RTOS multi-tasking
  useEffect(() => {
    const logInterval = setInterval(() => {
      if (systemRun && !emergencyActive && !maintenanceInProgress) {
        const rand = Math.random();
        if (rand < 0.3) {
          addLog(`[TASK_SENSOR] Read ADXL345: X=${Math.floor(Math.sin(Date.now() / 1000) * 45)}, Y=${Math.floor(Math.cos(Date.now() / 1000) * 45)}, Z=250 | VibA=${vibrationVal}, VibB=${Math.max(0, vibrationVal + Math.floor(Math.sin(Date.now() / 300) * 6))}`);
        } else if (rand < 0.6) {
          addLog(`[TASK_ULTRASONIC] HC-SR04 scan: ${proximityCm} cm | Current Person: ${personState}`);
        } else if (rand < 0.8) {
          addLog(`[TASK_CONTROL] Preemptive state checks ok. OverallState: ${overallState}`);
        }
      }
    }, 2200);

    return () => clearInterval(logInterval);
  }, [systemRun, emergencyActive, maintenanceInProgress, vibrationVal, proximityCm, personState, overallState]);

  // 6. Maintenance Countdown ticks
  useEffect(() => {
    if (maintenanceInProgress && maintCountdown > 0) {
      const timer = setTimeout(() => {
        setMaintCountdown(prev => prev - 1);
        setTerminalHistory(prev => [...prev, `[MAINT] Level ${selectedMaintLevel} countdown: ${maintCountdown - 1} sec remaining.`]);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (maintenanceInProgress && maintCountdown === 0) {
      // Completed maintenance!
      setMaintenanceInProgress(false);
      const info = MAINTENANCE_LEVELS[selectedMaintLevel - 1];
      const oldHealth = machineHealth;
      const newHealth = Math.min(100, machineHealth + info.healthGain);
      setMachineHealth(newHealth);
      setTotalMaintenanceCost(prev => prev + info.cost);
      setDoorHoldClosedUntilStart(true);
      setDoorState('LOCKED');
      setServoAngle(90);

      const totalProd = productCountA + productCountB;
      const profit = totalProd * 10;
      const net = profit - (totalMaintenanceCost + info.cost);

      addLog(`[MAINT] Completed standard service restoration. Machine health: ${newHealth}%`);
      setTerminalHistory(prev => [
        ...prev,
        `[MAINT] Finished. Health ${oldHealth} -> ${newHealth} | profit=$${profit} cost=$${totalMaintenanceCost + info.cost} net=$${net}.`,
        `Gate at 90 deg. Type 'start' or click Blue START button to physically reopen and restart.`
      ]);
    }
  }, [maintenanceInProgress, maintCountdown, selectedMaintLevel, machineHealth, totalMaintenanceCost, productCountA, productCountB]);

  // 7. Simulated beeping buzzer effect wave intervals
  useEffect(() => {
    if (overallState === 'EMERGENCY' || !systemRun || maintenanceInProgress) {
      setBuzzerActive(false);
      return;
    }

    let intervalTime = 0;
    let beepDuration = 0;

    if (personState === 'WARN' && overallState === 'NORMAL') {
      intervalTime = 1500;
      beepDuration = 100;
    } else if (overallState === 'WARNING') {
      intervalTime = 2000;
      beepDuration = 120;
    } else if (overallState === 'RECOVERY') {
      intervalTime = 1000;
      beepDuration = 120;
    } else if (overallState === 'DANGER') {
      intervalTime = 4000 / 10; // Rapid beeping
      beepDuration = 150;
    }

    if (intervalTime === 0) {
      setBuzzerActive(false);
      return;
    }

    const buzzerTimer = setInterval(() => {
      setBuzzerActive(true);
      setTimeout(() => setBuzzerActive(false), beepDuration);
    }, intervalTime);

    return () => clearInterval(buzzerTimer);
  }, [overallState, personState, systemRun, maintenanceInProgress]);

  // Physical Start/Pause Button (PC13) click handler
  const handlePhysicalStartToggle = () => {
    if (emergencyActive) {
      setTerminalHistory(prev => [...prev, '\r\n[ERROR] Emergency is latched. Type \'clear\' or click RESET.', '> ']);
      return;
    }

    if (systemRun) {
      // Pause
      setSystemRun(false);
      setServoHardLock(true);
      setDoorHoldClosedUntilStart(true);
      setDoorState('LOCKED');
      setServoAngle(90);
      addLog('[EVENT] Conveyors paused. Servo physically at 90 deg.');
      setTerminalHistory(prev => [...prev, '[EVENT] Conveyors paused. Servo physically at 90 deg.']);
    } else {
      // Start (requires physical reopen)
      setTerminalHistory(prev => [...prev, 'Opening door... please wait.']);
      setTimeout(() => {
        setServoHardLock(false);
        setDoorHoldClosedUntilStart(false);
        setDoorState('OPEN');
        setServoAngle(0);
        setSystemRun(true);
        addLog('[EVENT] Servo physically open. Conveyors started.');
        setTerminalHistory(prev => [...prev, 'Servo physically open. Conveyors started.']);
      }, 600);
    }
  };

  // Trigger Emergency Stop routine
  const triggerEmergencyStop = (reason: string) => {
    setSystemRun(false);
    setServoHardLock(true);
    setDoorHoldClosedUntilStart(true);
    setDoorState('LOCKED');
    setServoAngle(90);
    setEmergencyActive(true);
    setVibStateA('EMERGENCY');
    setVibStateB('EMERGENCY');
    setOverallState('EMERGENCY');

    addLog(`🛑 [ISR_EMERGENCY] Emergency stop triggered! Reason: ${reason}`);
    addLog('🔒 Unified Safety Routine: Calling ForceServo90Deg() to lock the mechanical barrier.');
    addLog('⚡ [POWER_CUT] Conveyor motors isolated safely. System secured.');

    setTerminalHistory(prev => [
      ...prev,
      '==================================================',
      ` !!! ${reason.toUpperCase()} - EMERGENCY STOP !!!`,
      ' Servo physically closed to 90 deg. All outputs OFF.',
      ' Release ESTOP/Person then type \'clear\' or click reset.',
      '=================================================='
    ]);
  };

  // Physical Maintenance Button PC0 click
  const handlePhysicalMaintClick = () => {
    triggerMaintenance();
  };

  // Main maintenance triggering
  const triggerMaintenance = () => {
    if (machineHealth > 70) {
      setTerminalHistory(prev => [...prev, `Maintenance denied: MachineHealth=${machineHealth}. Allowed only when <= 70.`]);
      addLog(`[MAINT] Denied: Health is too high (${machineHealth}%)`);
      return;
    }
    if (emergencyActive) {
      setTerminalHistory(prev => [...prev, 'Maintenance denied: emergency is active. Release or clear emergency first.']);
      addLog('[MAINT] Denied: Emergency active');
      return;
    }
    if (maintenanceInProgress) {
      setTerminalHistory(prev => [...prev, 'Maintenance denied: already in progress.']);
      return;
    }

    const info = MAINTENANCE_LEVELS[selectedMaintLevel - 1];
    setSystemRun(false);
    setServoHardLock(true);
    setDoorHoldClosedUntilStart(true);
    setDoorState('LOCKED');
    setServoAngle(90);
    setMaintenanceInProgress(true);
    setMaintCountdown(info.downtime);

    addLog(`[MAINT] Starting ${info.name}. cost=$${info.cost}, health +${info.healthGain}%, downtime=${info.downtime}s`);
    setTerminalHistory(prev => [...prev, `[MAINT] Starting ${info.name}. cost=$${info.cost}, health +${info.healthGain}%, downtime=${info.downtime}s`]);
  };

  // Reset Interlocks after emergency
  const handleResetInterlocks = () => {
    if (proximityCm <= 8) {
      setTerminalHistory(prev => [...prev, 'Cannot clear: person still detected near the sensor (<=8cm).']);
      return;
    }
    if (machineHealth === 0) {
      setTerminalHistory(prev => [...prev, 'Cannot clear: MachineHealth is 0. Use \'maint\' first.']);
      return;
    }

    setEmergencyActive(false);
    setSystemRun(false);
    setVibStateA('NORMAL');
    setVibStateB('NORMAL');
    setOverallState('NORMAL');
    setDoorHoldClosedUntilStart(true);
    setDoorState('LOCKED');
    setServoAngle(90);
    setVibrationVal(32);
    setProximityCm(120);

    addLog('[SYSTEM_RESET] Clearing safety interlocks...');
    addLog('[OS_PEND] Tasks unblocked. Safe state re-established.');
    setTerminalHistory(prev => [
      ...prev,
      'Emergency cleared. Type \'start\' or click Blue START button to physically reopen gate and restart.'
    ]);
  };

  // Terminal commands interpreter (Matching app.c exactly)
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmdStr = terminalInput.trim();
    if (!cmdStr) return;

    setTerminalHistory(prev => [...prev, `> ${cmdStr}`]);

    const normalized = cmdStr.trim().toLowerCase();
    const parts = normalized.split(/\s+/);
    const cmd = parts[0];
    const subCmd = parts.slice(1).join(' ');

    if (cmd === 'help') {
      setTerminalHistory(prev => [
        ...prev,
        'Commands:',
        '  start         - physically open servo (600ms), then start conveyors',
        '  stop          - physically close servo to 90 deg (600ms), then stop',
        '  status        - print current status',
        '  count         - print product counts',
        '  ultra         - print ultrasonic distance/person state',
        '  money         - print profit / cost / net',
        '  pot           - print potentiometer maintenance level',
        '  maint         - apply maintenance if health <= 70',
        '  clear         - clear latched emergency',
        '  help          - this list'
      ]);
    } else if (cmd === 'start') {
      if (emergencyActive) {
        setTerminalHistory(prev => [...prev, 'Cannot start: emergency is latched. Type \'clear\' first.']);
      } else {
        setTerminalHistory(prev => [...prev, 'Opening door... please wait.']);
        setTimeout(() => {
          setServoHardLock(false);
          setDoorHoldClosedUntilStart(false);
          setDoorState('OPEN');
          setServoAngle(0);
          setSystemRun(true);
          setTerminalHistory(prev => [...prev, 'Servo physically open. Conveyors started.']);
          addLog('[EVENT] Servo physically open. Conveyors started.');
        }, 600);
      }
    } else if (cmd === 'stop') {
      setSystemRun(false);
      setServoHardLock(true);
      setDoorHoldClosedUntilStart(true);
      setDoorState('LOCKED');
      setServoAngle(90);
      setTerminalHistory(prev => [...prev, 'Servo physically at 90 deg. Conveyors stopped. Type \'start\' to reopen.']);
      addLog('[EVENT] Conveyors paused. Servo physically at 90 deg.');
    } else if (cmd === 'status') {
      const selectedInfo = MAINTENANCE_LEVELS[selectedMaintLevel - 1];
      const profit = (productCountA + productCountB) * 10;
      setTerminalHistory(prev => [
        ...prev,
        `run=${systemRun ? 1 : 0} emergency=${emergencyActive ? 1 : 0} maintenance=${maintenanceInProgress ? 1 : 0} door_hold=${doorHoldClosedUntilStart ? 1 : 0} servo_lock=${servoHardLock ? 1 : 0}`,
        `x=${Math.floor(Math.sin(Date.now() / 1000) * 45)} y=${Math.floor(Math.cos(Date.now() / 1000) * 45)} z=250`,
        `A[state=${vibStateA} vib=${vibrationVal} delay=${getDelayMs(vibStateA)}]`,
        `B[state=${vibStateB} vib=${Math.max(0, vibrationVal + Math.floor(Math.sin(Date.now() / 300) * 6))} delay=${getDelayMs(vibStateB)}]`,
        `person=${personState} dist=${proximityCm} cm`,
        `door=${doorState}(${servoAngle}deg) (0deg=open 45deg=warn 90deg=locked/stop)`,
        `health=${machineHealth}/100 maintenance_allowed=${machineHealth <= 70 ? 'YES' : 'NO'}`,
        `pot_adc=${potAdcRaw} selected=${selectedInfo.name}`,
        `runtime=${factoryRunTimeSec} sec products=${productCountA + productCountB} profit=$${profit} cost=$${totalMaintenanceCost} net=$${profit - totalMaintenanceCost}`
      ]);
    } else if (cmd === 'count') {
      setTerminalHistory(prev => [...prev, `>>> ConveyorA Count: ${productCountA} , ConveyorB count: ${productCountB}`]);
    } else if (cmd === 'ultra' || cmd === 'distance') {
      setTerminalHistory(prev => [...prev, `distance=${proximityCm} cm person=${personState} emergency<=8 cm warning<45 cm`]);
    } else if (cmd === 'test' && subCmd === 'emergency' || cmd === 'emergency' && subCmd === 'test') {
      triggerEmergencyStop('Manual Test Trigger');
    } else if (cmd === 'money' || cmd === 'profit') {
      const selectedInfo = MAINTENANCE_LEVELS[selectedMaintLevel - 1];
      const profit = (productCountA + productCountB) * 10;
      setTerminalHistory(prev => [
        ...prev,
        `runtime=${factoryRunTimeSec} sec`,
        `products: A=${productCountA} B=${productCountB} total=${productCountA + productCountB}`,
        `profit=$${profit} cost=$${totalMaintenanceCost} net=$${profit - totalMaintenanceCost}`,
        `MachineHealth=${machineHealth} / 100`,
        `maintenance_allowed=${machineHealth <= 70 ? 'YES' : 'NO'} (condition: MachineHealth <= 70)`,
        `pot_adc=${potAdcRaw} selected=${selectedInfo.name}`,
        `selected_cost=$${selectedInfo.cost} selected_health_gain=${selectedInfo.healthGain}% selected_downtime=${selectedInfo.downtime} sec`
      ]);
    } else if (cmd === 'pot') {
      const selectedInfo = MAINTENANCE_LEVELS[selectedMaintLevel - 1];
      setTerminalHistory(prev => [...prev, `pot_adc=${potAdcRaw} selected=${selectedInfo.name} cost=$${selectedInfo.cost} health_gain=${selectedInfo.healthGain}% downtime=${selectedInfo.downtime} sec`]);
    } else if (cmd === 'maint' || cmd === 'maintenance') {
      triggerMaintenance();
    } else if (cmd === 'clear') {
      if (!emergencyActive) {
        setTerminalHistory(prev => [...prev, 'No emergency is active.']);
      } else if (proximityCm <= 8) {
        setTerminalHistory(prev => [...prev, 'Cannot clear: person still detected near the sensor (<=8cm).']);
      } else if (machineHealth === 0) {
        setTerminalHistory(prev => [...prev, 'Cannot clear: MachineHealth is 0. Use \'maint\' first.']);
      } else {
        setEmergencyActive(false);
        setSystemRun(false);
        setVibStateA('NORMAL');
        setVibStateB('NORMAL');
        setOverallState('NORMAL');
        setDoorHoldClosedUntilStart(true);
        setDoorState('LOCKED');
        setServoAngle(90);
        setTerminalHistory(prev => [...prev, 'Emergency cleared. Type \'start\' to physically reopen gate and restart.']);
        addLog('[EVENT] Emergency cleared. System standing by.');
      }
    } else {
      setTerminalHistory(prev => [...prev, `Unknown command '${cmd}'. Type 'help'.`]);
    }

    setTerminalInput('');
  };

  return (
    <div id="rtos-safety" className="scroll-mt-20 border border-slate-800/80 rounded-2xl bg-slate-950/40 p-6 md:p-8 backdrop-blur-md mb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <span className="text-xs font-mono text-amber-500 font-semibold uppercase tracking-wider">PROJECT 02 • High-Reliability Embedded RTOS</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-1 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-500" />
            <span>RTOS-Factory-Safety-Controller (STM32 Simulation)</span>
          </h2>
          <p className="text-sm text-slate-400 italic mt-1 font-sans">
            Fail-Secure Industrial Automation & Co-operative Conveyor Task Orchestration matching <strong>app.c</strong>
          </p>
        </div>

        {/* Subtitle metadata */}
        <div className="text-xs font-mono text-slate-400">
          STM32 · uC/OS-III · 9 Concurrent Tasks
        </div>
      </div>

      {/* Structured Case Study Breakdown */}
      <ProjectBreakdown
        accentColor="amber"
        overview="A deterministic, fail-secure industrial dual-conveyor safety controller built on STM32 and uC/OS-III (matching app.c firmware logic), orchestrating emergency interrupts, vibration hysteresis, human proximity interlocks, and mechanical servo locking."
        problem="Industrial conveyor lines risk severe mechanical jamming and operator injury if emergency stops, abnormal motor vibration, or human proximity breaches are handled by non-deterministic polling loops instead of prioritized real-time interlocks."
        role="Embedded RTOS Systems Architect — Designed the 9-task preemptive priority table, ISR semaphore bypasses, unified ForceServo90Deg() safety gate bottleneck, ADXL345 hysteresis state machine, and interactive digital twin."
        technologies={[
          'C / C++',
          'uC/OS-III RTOS',
          'STM32 HAL',
          'ADXL345 (I2C Vibration)',
          'HC-SR04 Ultrasonic',
          'SG90 Servo (PWM TIM5)',
          'ADC Potentiometer & UART CLI',
        ]}
        results="Enforced hardware-first fail-secure interlocking where the SG90 barrier physically locks at 90 degrees before motor power cutoff, plus a two-tier evacuation flush to clear materials before shutdown."
        videoDemoUrl="https://drive.google.com/file/d/1w6lk_oMkiXUfYjyfHsjD6W5wp_quuKwD/view?usp=share_link"
        videoDemoLabel="Project Video Demo"
        sourceCodeUrl="https://github.com/moshi89"
        interactiveDemoLabel="Digital Twin Simulator"
        inPageCodeLabel="RTOS Task Priorities"
        onRunInteractiveDemo={() => {
          setActiveTab('simulator');
          document.getElementById('rtos-demo-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onViewInPageCode={() => {
          setActiveTab('tasks');
          document.getElementById('rtos-demo-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {/* Tabs */}
      <div id="rtos-demo-tabs" className="flex border-b border-slate-800/60 mb-6 scroll-mt-24">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 border-b-2 font-display text-sm font-medium transition-all ${
            activeTab === 'simulator'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Industrial Digital Twin Simulator
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 border-b-2 font-display text-sm font-medium transition-all ${
            activeTab === 'tasks'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          uC/OS-III RTOS Task priorities
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'simulator' ? (
          <motion.div
            key="simulator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Column: Controls & Sensor Inputs */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/20 border border-slate-800/50 p-5 rounded-xl space-y-5">
                <h3 className="text-xs uppercase tracking-wider font-mono text-slate-400 font-bold flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-amber-500" />
                  <span>Interactive Sensor Stimulators</span>
                </h3>

                {/* ADXL345 Vibration Hz Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-orange-400" />
                      Vibration Sensor (ADXL345 I2C)
                    </span>
                    <span className="font-mono text-orange-400 font-bold">{vibrationVal} g/raw</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={vibrationVal}
                    disabled={maintenanceInProgress}
                    onChange={(e) => setVibrationVal(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Norm (&lt;35)</span>
                    <span>Warn (35+)</span>
                    <span>Danger (120+)</span>
                    <span>Shutdown (380+)</span>
                  </div>
                </div>

                {/* HC-SR04 Proximity Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-sky-400" />
                      Ultrasonic Proximity (HC-SR04)
                    </span>
                    <span className="font-mono text-sky-400 font-bold">{proximityCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="200"
                    value={proximityCm}
                    disabled={maintenanceInProgress}
                    onChange={(e) => setProximityCm(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Near Stop (&lt;=8cm)</span>
                    <span>Warning (9-44cm)</span>
                    <span>Safe (45cm+)</span>
                  </div>
                </div>

                {/* Potentiometer Slider for Maintenance Selector */}
                <div className="space-y-2 pt-1 border-t border-slate-800/40">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                      Potentiometer Selector (PA4 ADC)
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">ADC: {potAdcRaw}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4095"
                    value={potAdcRaw}
                    onChange={(e) => setPotAdcRaw(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  
                  {/* Selected Maintenance info display */}
                  <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80 text-[11px] font-sans text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-100">{MAINTENANCE_LEVELS[selectedMaintLevel - 1].name}</span>
                      <span className="font-mono text-emerald-400 font-semibold">Cost: ${MAINTENANCE_LEVELS[selectedMaintLevel - 1].cost}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Restoration: +{MAINTENANCE_LEVELS[selectedMaintLevel - 1].healthGain}% Health</span>
                      <span>Downtime: {MAINTENANCE_LEVELS[selectedMaintLevel - 1].downtime}s countdown</span>
                    </div>
                  </div>
                </div>

                {/* Actuator indicators */}
                <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/60 text-center">
                    <span className="text-slate-500 block text-[10px] mb-1">SERVO GATE POSITION</span>
                    <span className={`font-semibold ${servoAngle > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {servoAngle}° ( {doorState} )
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/60 text-center">
                    <span className="text-slate-500 block text-[10px] mb-1">CONVEYOR SPEED</span>
                    <span className={`font-semibold ${
                      !systemRun ? 'text-red-500' :
                      overallState === 'DANGER' ? 'text-rose-400 animate-pulse' :
                      overallState === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {!systemRun ? '0% PAUSED' :
                       overallState === 'DANGER' ? '120ms (FAST)' :
                       overallState === 'WARNING' ? '250ms (MED-FAST)' : '350ms (NORMAL)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical STM32 Nucleo Board Buttons */}
              <div className="space-y-3 bg-slate-900/10 border border-slate-800/40 rounded-xl p-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">STM32 Nucleo-F429ZI Physical Inputs</span>
                
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Start Button (PC13 - Blue Button) */}
                  <button
                    onClick={handlePhysicalStartToggle}
                    className={`h-12 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all text-xs font-semibold ${
                      systemRun 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400 hover:bg-blue-600/30' 
                        : 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500 shadow-md shadow-blue-900/30'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    <span>{systemRun ? 'PAUSE' : 'START'} (PC13)</span>
                  </button>

                  {/* Maint Button (PC0) */}
                  <button
                    onClick={handlePhysicalMaintClick}
                    disabled={maintenanceInProgress || machineHealth > 70}
                    className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-0.5 text-xs font-semibold"
                  >
                    <RefreshCw className="w-4 h-4 text-emerald-400" />
                    <span>MAINT (PC0)</span>
                  </button>

                  {/* Red Industrial ESTOP Button (PC1) */}
                  <button
                    onClick={() => triggerEmergencyStop('Manual E-STOP (PC1)')}
                    disabled={emergencyActive}
                    className="h-12 rounded-xl bg-rose-700 hover:bg-rose-600 border border-rose-600 disabled:bg-rose-950/30 disabled:border-rose-950 disabled:text-rose-900 text-white flex flex-col items-center justify-center gap-0.5 text-xs font-bold transition-all shadow-md shadow-rose-950/40"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>E-STOP (PC1)</span>
                  </button>
                </div>

                {emergencyActive && (
                  <button
                    onClick={handleResetInterlocks}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/20"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>CLEAR EMERGENCY INTERLOCKS</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Graphic Twin & Realtime Logs & Interactive USART3 Terminal */}
            <div className="lg:col-span-7 space-y-6 flex flex-col">
              
              {/* Graphical Digital Twin View */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex-1 min-h-[220px]">
                {/* Flashing alert borders based on state */}
                {overallState === 'WARNING' && (
                  <div className="absolute inset-0 border-2 border-amber-500/20 animate-pulse pointer-events-none rounded-xl" />
                )}
                {overallState === 'DANGER' && (
                  <div className="absolute inset-0 border-2 border-red-500/30 animate-pulse pointer-events-none rounded-xl" />
                )}
                {emergencyActive && (
                  <div className="absolute inset-0 border-2 border-red-600/40 animate-pulse pointer-events-none rounded-xl" />
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Digital Twin Status</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        emergencyActive ? 'bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse' :
                        !systemRun ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]' :
                        overallState === 'NORMAL' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' :
                        overallState === 'WARNING' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)] animate-pulse' :
                        'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-ping'
                      }`} />
                      <span className="font-display text-sm font-bold text-slate-100">
                        {emergencyActive ? 'SYS_STATE_EMERGENCY' :
                         maintenanceInProgress ? `MAINTENANCE COUNTDOWN: ${maintCountdown}s` :
                         !systemRun ? 'SYS_STATE_STOPPED' : `SYS_STATE_${overallState}`}
                      </span>
                    </div>
                  </div>

                  {/* Mapped STM32 outputs */}
                  <div className="flex items-center gap-3">
                    {/* RGB LED pin visualizer */}
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-mono text-slate-500">RGB LED</span>
                      <div className={`w-5 h-5 rounded-full border border-slate-800 transition-all ${
                        emergencyActive || !systemRun ? 'bg-slate-800 shadow-none' :
                        overallState === 'NORMAL' ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' :
                        overallState === 'WARNING' ? 'bg-pink-500 shadow-[0_0_12px_#ec4899]' :
                        overallState === 'RECOVERY' ? 'bg-blue-500 shadow-[0_0_12px_#3b82f6]' :
                        'bg-red-500 shadow-[0_0_12px_#ef4444]'
                      }`} />
                    </div>

                    {/* Buzzer pin visualizer */}
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-mono text-slate-500">BUZZER</span>
                      <div className="flex items-center gap-1 h-5">
                        {buzzerActive ? (
                          <>
                            <Volume2 className="w-4 h-4 text-rose-500 animate-bounce" />
                            <span className="text-[9px] font-mono text-rose-500 font-semibold">BEEP</span>
                          </>
                        ) : (
                          <VolumeX className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conveyor graphic simulation */}
                <div className="space-y-4 pt-2 pr-12">
                  {/* Conveyor A track */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>CONVEYOR BELT A (AppTaskConveyorA)</span>
                      <span>
                        {vibStateA === 'EMERGENCY' || !systemRun ? '❌ OFF' : 
                         vibStateA === 'DANGER' ? '⚡ FAST (120ms)' : 
                         vibStateA === 'WARNING' ? '⚠️ MED (250ms)' : '🟢 NORMAL (350ms)'}
                      </span>
                    </div>
                    <div className="h-10 w-full bg-slate-900 rounded-lg relative overflow-hidden border border-slate-800">
                      {/* Conveyor roller bands */}
                      <div className="absolute inset-0 flex">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={systemRun && !emergencyActive && !maintenanceInProgress ? { x: [0, 40] } : {}}
                            transition={{
                              repeat: Infinity,
                              ease: 'linear',
                              duration: vibStateA === 'DANGER' ? 0.25 : vibStateA === 'WARNING' ? 0.45 : 0.7
                            }}
                            className="h-full w-0.5 bg-slate-800 mr-8 shrink-0"
                          />
                        ))}
                      </div>
                      {/* Conveying products */}
                      {systemRun && !emergencyActive && !maintenanceInProgress && (
                        <div className="absolute inset-y-2 left-0 flex gap-16 items-center pl-4">
                          <motion.div
                            animate={{ x: [-20, 360] }}
                            transition={{ repeat: Infinity, duration: vibStateA === 'DANGER' ? 1.5 : vibStateA === 'WARNING' ? 2.5 : 3.5, ease: 'linear' }}
                            className="w-4 h-4 rounded bg-indigo-500 border border-indigo-400 shadow shadow-indigo-500/50"
                          />
                          <motion.div
                            animate={{ x: [-20, 360] }}
                            transition={{ repeat: Infinity, duration: vibStateA === 'DANGER' ? 1.5 : vibStateA === 'WARNING' ? 2.5 : 3.5, ease: 'linear', delay: 1.5 }}
                            className="w-4 h-4 rounded bg-purple-500 border border-purple-400 shadow shadow-purple-500/50"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Conveyor B track */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>CONVEYOR BELT B (AppTaskConveyorB)</span>
                      <span>
                        {vibStateB === 'EMERGENCY' || !systemRun ? '❌ OFF' : 
                         vibStateB === 'DANGER' ? '⚡ FAST (120ms)' : 
                         vibStateB === 'WARNING' ? '⚠️ MED (250ms)' : '🟢 NORMAL (350ms)'}
                      </span>
                    </div>
                    <div className="h-10 w-full bg-slate-900 rounded-lg relative overflow-hidden border border-slate-800">
                      <div className="absolute inset-0 flex">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={systemRun && !emergencyActive && !maintenanceInProgress ? { x: [0, 40] } : {}}
                            transition={{
                              repeat: Infinity,
                              ease: 'linear',
                              duration: vibStateB === 'DANGER' ? 0.25 : vibStateB === 'WARNING' ? 0.45 : 0.7
                            }}
                            className="h-full w-0.5 bg-slate-800 mr-8 shrink-0"
                          />
                        ))}
                      </div>
                      {systemRun && !emergencyActive && !maintenanceInProgress && (
                        <div className="absolute inset-y-2 left-0 flex gap-16 items-center pl-10">
                          <motion.div
                            animate={{ x: [-20, 360] }}
                            transition={{ repeat: Infinity, duration: vibStateB === 'DANGER' ? 1.5 : vibStateB === 'WARNING' ? 2.5 : 3.5, ease: 'linear', delay: 0.5 }}
                            className="w-4 h-4 rounded bg-emerald-500 border border-emerald-400 shadow shadow-emerald-500/50"
                          />
                          <motion.div
                            animate={{ x: [-20, 360] }}
                            transition={{ repeat: Infinity, duration: vibStateB === 'DANGER' ? 1.5 : vibStateB === 'WARNING' ? 2.5 : 3.5, ease: 'linear', delay: 2.2 }}
                            className="w-4 h-4 rounded bg-cyan-500 border border-cyan-400 shadow shadow-cyan-500/50"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mechanical Door Lock Barrier representation (SG90 Servo) */}
                <div className="absolute right-6 top-16 bottom-8 w-2.5 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                  <motion.div
                    animate={servoAngle === 90 ? { height: '100%', backgroundColor: '#ef4444' } : servoAngle === 45 ? { height: '50%', backgroundColor: '#f59e0b' } : { height: '15%', backgroundColor: '#10b981' }}
                    className="w-full rounded-full transition-all duration-300"
                  />
                  <div className="absolute -top-6 text-[9px] font-mono text-slate-500 flex flex-col items-center">
                    <span>SERVO</span>
                    <span className={`font-bold ${servoAngle === 90 ? 'text-red-400' : servoAngle === 45 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {servoAngle}°
                    </span>
                  </div>
                </div>
              </div>

              {/* System Metrics & Economy Widgets */}
              <div className="grid grid-cols-2 gap-4">
                {/* Machine Health Widget */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">Machine Health Integrity</span>
                    <span className={`text-xs font-mono font-bold ${machineHealth <= 70 ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}`}>
                      {machineHealth}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/60">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        machineHealth <= 30 ? 'bg-red-500' :
                        machineHealth <= 70 ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${machineHealth}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>0% FAILED</span>
                    <span className={machineHealth <= 70 ? 'text-orange-500/80 animate-pulse font-bold' : ''}>
                      {machineHealth <= 70 ? '⚠️ MAINTENANCE ALLOWED' : 'HEALTHY (&gt;70%)'}
                    </span>
                    <span>100% NOMINAL</span>
                  </div>
                </div>

                {/* Economics Financial Monitor */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 grid grid-cols-2 gap-2 text-xs font-sans">
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">SYS RUNTIME</span>
                    <span className="font-mono text-slate-200 font-semibold">{factoryRunTimeSec} sec</span>
                    <span className="text-[9px] font-mono text-slate-500 mt-1">PROD: A:{productCountA} | B:{productCountB}</span>
                  </div>
                  <div className="flex flex-col justify-center text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">NET INCOME</span>
                    <span className={`font-mono font-bold text-sm ${
                      (productCountA + productCountB) * 10 - totalMaintenanceCost >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      ${(productCountA + productCountB) * 10 - totalMaintenanceCost}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 mt-1">
                      REV: ${(productCountA + productCountB) * 10} / COST: ${totalMaintenanceCost}
                    </span>
                  </div>
                </div>
              </div>

              {/* RTOS Trace Logs and Interactive Console Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. RTOS Kernel Preemptive Task trace */}
                <div className="bg-black/95 rounded-xl border border-slate-800/80 p-3.5 font-mono text-xs text-slate-300 flex flex-col h-[200px]">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900 text-[10px] text-slate-500 mb-2">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wide">
                      <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                      uC/OS-III Preemptive Trace
                    </span>
                    <span>KERNEL TASK ENGINE</span>
                  </div>
                  <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin text-[10px]">
                    {logTrace.map((log, idx) => (
                      <div
                        key={idx}
                        className={`leading-relaxed ${
                          log.includes('🛑') || log.includes('🔒') || log.includes('error') ? 'text-rose-400 font-bold' :
                          log.includes('⚠️') || log.includes('🚨') ? 'text-amber-400' :
                          log.includes('✅') || log.includes('OS_INIT') || log.includes('restored') ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Interactive STM32 USART3 Terminal */}
                <div className="bg-black border border-slate-800/80 rounded-xl p-3.5 font-mono text-xs flex flex-col h-[200px] text-emerald-400">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900 text-[10px] text-emerald-600 mb-1">
                    <span className="flex items-center gap-1.5 font-bold tracking-wider">
                      <Terminal className="w-3.5 h-3.5" />
                      USART3 SERIAL CONSOLE
                    </span>
                    <span>115200 BAUD</span>
                  </div>
                  
                  {/* Console lines */}
                  <div ref={terminalContainerRef} className="flex-1 overflow-y-auto space-y-1.5 pr-1.5 scrollbar-thin text-[10px] leading-relaxed">
                    {terminalHistory.map((line, idx) => (
                      <div key={idx} className={
                        line.startsWith('>') ? 'text-sky-300 font-semibold' :
                        line.includes('!!!') ? 'text-rose-500 font-bold uppercase' :
                        line.includes('Commands:') || line.includes('start') && line.includes('-') ? 'text-slate-400' :
                        'text-emerald-400'
                      }>
                        {line}
                      </div>
                    ))}
                  </div>

                  {/* Terminal input form */}
                  <form onSubmit={handleCommandSubmit} className="mt-2 flex border-t border-slate-900 pt-1.5">
                    <span className="text-sky-400 select-none mr-1.5 font-bold font-mono">&gt;</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Type 'help' for STM32 CLI commands..."
                      className="flex-1 bg-transparent border-none outline-none text-emerald-300 font-mono text-[10px] placeholder-emerald-800"
                    />
                  </form>
                </div>

              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-slate-300 font-sans"
          >
            {/* Architectural overview */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white font-display">Preemptive Multi-tasking RTOS Architecture</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                The controller executes a highly deterministic safety architecture where task execution is prioritized based on severity. Critical interrupts bypass standard conveyor loop runtimes, guaranteeing instant mitigation of electrical/mechanical hazards.
              </p>
            </div>

            {/* Priority Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/10">
              <table className="w-full border-collapse text-left text-xs font-sans">
                <thead>
                  <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
                    <th className="p-3.5 font-semibold">Task Name</th>
                    <th className="p-3.5 font-semibold text-center">Priority</th>
                    <th className="p-3.5 font-semibold">Trigger Condition</th>
                    <th className="p-3.5 font-semibold">Primary Core Responsibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {RTOS_TASKS.map((task) => (
                    <tr
                      key={task.name}
                      className={`hover:bg-slate-900/30 transition-colors ${
                        task.priority <= 4 ? 'bg-red-950/10' : task.priority <= 6 ? 'bg-orange-950/5' : ''
                      }`}
                    >
                      <td className="p-3.5 font-mono font-bold text-slate-200">{task.name}</td>
                      <td className="p-3.5 text-center font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded ${
                          task.priority <= 3 ? 'bg-red-500/20 text-red-400' :
                          task.priority <= 6 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-400 text-[11px]">{task.trigger}</td>
                      <td className="p-3.5 text-slate-300">{task.responsibility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Design highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-xl bg-slate-900/30 border border-slate-800/50 space-y-2">
                <h4 className="text-sm font-semibold font-display text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Unified Safety Routine: ForceServo90Deg()</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A high-integrity bottleneck function configured as a secure state gate. During critical situations, it utilizes uC/OS-III semaphores to force the safety servo gate to 90 degrees immediately, locking the physical cabinet <strong>before</strong> electrical power is isolated from the mechanical conveyor motors, satisfying rigorous industrial safety interlock requirements.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/30 border border-slate-800/50 space-y-2">
                <h4 className="text-sm font-semibold font-display text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Two-Tier Emergency Evacuation Protocol</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unlike simple systems that halt instantly, this controller senses impending system failure (vibrations up to 75 Hz). It executes an intelligent flushing phase, running conveyors at maximum overclocked frequencies to flush materials clear of the mechanical gate before shutting down. This prevents physical jamming and material loss.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
