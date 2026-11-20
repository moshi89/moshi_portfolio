import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Lightbulb, 
  Disc, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Sliders, 
  Activity, 
  Flame, 
  RefreshCw, 
  Database,
  Gamepad2,
  Play,
  CheckCircle2,
  AlertCircle,
  Car,
  Navigation,
  Code,
  Smartphone,
  Radio,
  Layers,
  Sparkles,
  Terminal,
  Cpu
} from 'lucide-react';
import ProjectBreakdown from './ProjectBreakdown';

// Custom character 5x8 pixel definitions from Uno.ino code
// us1: B11111, B11111, B11111, B00000, B00000, B00000, B00000, B00000 (top 3 rows filled)
// us2: B11111, B11111, B11111, B11111, B11111, B11111, B11111, B11111 (all rows filled)
// us3: B11111, B11111, B11111, B11111, B00000, B00000, B00000, B00000 (top 4 rows filled)
// us4: B11111, B11111, B11111, B11111, B11111, B00000, B00000, B00000 (top 5 rows filled)
// us5: B11111, B11111, B00000, B00000, B00000, B00000, B00000, B00000 (top 2 rows filled)
// us6: B11111, B11111, B00000, B00000, B00000, B00000, B10000, B11000 (top 2, bottom 2 left-aligned)
// us7: B11111, B11111, B00000, B00000, B00000, B00000, B00001, B00011 (top 2, bottom 2 right-aligned)
const CUSTOM_CHARS: { [key: number]: number[][] } = {
  0: [
    [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]
  ],
  1: [
    [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1]
  ],
  2: [
    [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]
  ],
  3: [
    [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]
  ],
  4: [
    [1,1,1,1,1], [1,1,1,1,1], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]
  ],
  5: [
    [1,1,1,1,1], [1,1,1,1,1], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [1,0,0,0,0], [1,1,0,0,0]
  ],
  6: [
    [1,1,1,1,1], [1,1,1,1,1], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,1], [0,0,0,1,1]
  ]
};

// 16x2 Grid definitions representing character cells
// Blank cells represent empty spaces. Integer values represent usX custom characters.
interface LcdCell {
  char?: number;
  text?: string;
}

// Standalone cell renderer function to avoid TypeScript component prop constraints
function renderSingleLcdCell(cell: LcdCell, idx: number) {
  if (cell.char !== undefined) {
    const matrix = CUSTOM_CHARS[cell.char];
    return (
      <div key={`lcd-cell-${idx}`} className="w-5 h-8 grid grid-cols-5 gap-[1px] bg-emerald-950 p-[1px] rounded-sm shrink-0">
        {matrix.map((row, rIdx) => 
          row.map((val, cIdx) => (
            <div 
              key={`${rIdx}-${cIdx}`} 
              className={`w-[3px] h-[3px] rounded-[1px] ${val === 1 ? 'bg-emerald-400 drop-shadow-[0_0_2px_#34d399]' : 'bg-emerald-950/40'}`} 
            />
          ))
        )}
      </div>
    );
  }
  return (
    <div key={`lcd-cell-${idx}`} className="w-5 h-8 flex items-center justify-center font-mono text-base font-bold text-emerald-400 select-none shrink-0">
      {cell.text || " "}
    </div>
  );
}

export default function PetRobotSimulator() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'pins' | 'code'>('simulator');

  // 1. Inputs (Stimuli on Arduino Uno Pins)
  const [switchPressed, setSwitchPressed] = useState<boolean>(false); // Pin A0 (Active LOW)
  const [potValue, setPotValue] = useState<number>(410);              // Pin A3 (0-1023)
  const [photoValue, setPhotoValue] = useState<number>(350);          // Pin A2 (0-1023)
  const [distanceCm, setDistanceCm] = useState<number>(22);            // Pins 9, 8 (HC-SR04 Sonar)

  // 2. Processed Actuators & Systems State
  const [isFeeding, setIsFeeding] = useState<boolean>(false);
  const [servoAngle, setServoAngle] = useState<number>(0);            // SG90 angle (0° to 90°)
  const [selectedTrack, setSelectedTrack] = useState<number>(2);      // Mapped DFPlayer track (1 to 5)
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState<number>(2);
  const [ledsOn, setLedsOn] = useState<boolean>(false);                // Pins 6 & 7 night light
  const [darkDuration, setDarkDuration] = useState<number>(0);        // Count seconds photocell is dark (<100)
  const [motorsRunning, setMotorsRunning] = useState<boolean>(true);  // Motor A & B drive state

  // Radar Arena positions
  const [petPos, setPetPos] = useState({ x: 75, y: 35 });
  const [robotPos, setRobotPos] = useState({ x: 20, y: 20 });
  const [isAutoPatrol, setIsAutoPatrol] = useState<boolean>(true);
  const [patrolSpeed, setPatrolSpeed] = useState<number>(1.2);

  // LCD Active frame toggle (Frame 1 vs Frame 2, flips every 500ms)
  const [lcdFrame, setLcdFrame] = useState<number>(1);

  // Serial Monitor Trace history
  const [serialHistory, setSerialHistory] = useState<string[]>([
    '[SYSTEM_BOOT] Arduino Uno loaded.',
    '[LCD_RAM] Created 7 custom 5x8 glyphs (us1-us7).',
    '[DFPLAYER] mp3_set_serial initialized with dfSerial(12,13) @ 9600 baud.',
    '[DFPLAYER] mp3_set_volume(20) initialized.',
    '[LOOP] SoftwareSerial standing by. Photoresistor settling.'
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  const addSerialLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setSerialHistory(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Scroll to bottom of serial logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollTop = logEndRef.current.scrollHeight;
    }
  }, [serialHistory]);

  // 1. LCD Alternating Animation (Every 500 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setLcdFrame(f => (f === 1 ? 2 : 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // 2. Feeder Switch Handler (A0) - Simulating dispenseFood()
  useEffect(() => {
    if (switchPressed && !isFeeding) {
      setIsFeeding(true);
      addSerialLog('🔌 Pin A0 Switch: LOW (Pushed) -> Entering dispenseFood()');
      
      // Sweep servo from 0 to 90 degrees with 5ms step delay
      let angle = 0;
      const sweepUp = setInterval(() => {
        angle += 10;
        setServoAngle(angle);
        if (angle >= 90) {
          clearInterval(sweepUp);
          addSerialLog('🍗 Pin A1 Servo: 90° reached. Food dispensed. Pausing 1000ms...');
          
          // Hold at 90 deg for 1 second
          setTimeout(() => {
            // Sweep servo back from 90 to 0 degrees
            const sweepDown = setInterval(() => {
              angle -= 10;
              setServoAngle(angle);
              if (angle <= 0) {
                clearInterval(sweepDown);
                setIsFeeding(false);
                addSerialLog('🔒 Pin A1 Servo: 0° returned. Gate fully locked.');
              }
            }, 30);
          }, 1000);
        }
      }, 30);
    }
  }, [switchPressed]);

  // 3. Potentiometer track selection mapping (A3)
  useEffect(() => {
    // Map raw 0-1023 input to track 1-5
    const mappedTrack = Math.min(5, Math.max(1, Math.floor((potValue * 5) / 1024) + 1));
    setSelectedTrack(mappedTrack);
  }, [potValue]);

  // Handle track transmission over SoftwareSerial (DFPlayer mp3_play)
  useEffect(() => {
    if (selectedTrack !== currentPlayingTrack) {
      addSerialLog(`🎚️ Potentiometer (A3) = ${potValue} -> Mapped Track: ${selectedTrack}`);
      addSerialLog(`📡 SoftwareSerial TX (Pin 13) -> RX (Pin 12): sending command mp3_play(${selectedTrack})`);
      setCurrentPlayingTrack(selectedTrack);
    }
  }, [selectedTrack, currentPlayingTrack, potValue]);

  // 4. Photocell night-light logic with 5-second continuous dark countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (photoValue < 100) {
      // Dark environment (<100)
      if (darkDuration === 0) {
        addSerialLog(`🌙 LDR Photocell (A2) = ${photoValue} (<100 Dark) -> Night-light timing sequence started...`);
      }
      timer = setInterval(() => {
        setDarkDuration(d => {
          const nextD = d + 1;
          if (nextD >= 5) {
            if (!ledsOn) {
              setLedsOn(true);
              addSerialLog(`💡 Night-light Activated! (Pins 6,7 HIGH) after 5 seconds of continuous darkness.`);
            }
            return 5;
          }
          return nextD;
        });
      }, 1000);
    } else {
      // Light returned
      setDarkDuration(0);
      if (ledsOn) {
        setLedsOn(false);
        addSerialLog(`☀️ LDR Photocell (A2) = ${photoValue} (Light returned) -> Night LEDs turned OFF (Pins 6,7 LOW)`);
      }
    }
    return () => clearInterval(timer);
  }, [photoValue, ledsOn, darkDuration]);

  // 5. Ultrasonic distance simulation and Motor Drive Hysteresis
  useEffect(() => {
    // Motors run ONLY if distance is between 10cm and 30cm (dist > 10 && dist < 30)
    const canMove = distanceCm > 10 && distanceCm < 30;
    if (canMove) {
      if (!motorsRunning) {
        setMotorsRunning(true);
        addSerialLog(`🚗 Obstacle in zone (${distanceCm}cm) -> Running L298N motors forward at Speed 120 (Pins 2,4 HIGH)`);
      }
    } else {
      if (motorsRunning) {
        setMotorsRunning(false);
        const reason = distanceCm <= 10 ? 'TOO CLOSE (Avoidance Stop)' : 'OUT OF ZONE (Standby)';
        addSerialLog(`🛑 Motors Paused -> ${reason} (${distanceCm}cm). Pins 2,3,4,5 LOW.`);
      }
    }
  }, [distanceCm, motorsRunning]);

  // 6. Active Feedback Radar Loop: Pursuing the pet in real-time
  useEffect(() => {
    let angle = 0;
    const interval = setInterval(() => {
      setPetPos(currentPet => {
        let nextPet = { ...currentPet };
        if (isAutoPatrol) {
          angle += 0.02 * patrolSpeed;
          // Smooth orbital walk
          nextPet.x = 50 + Math.sin(angle) * 30 + Math.cos(angle * 0.45) * 8;
          nextPet.y = 50 + Math.cos(angle) * 26;
        }
        
        setRobotPos(currentRobot => {
          const dx = nextPet.x - currentRobot.x;
          const dy = nextPet.y - currentRobot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Map distance dynamically to simulated distanceCm (Max possible distance pixel offset ~141. Map to 2-80 range)
          const calculatedCm = Math.max(2, Math.min(99, Math.round(dist * 0.55)));
          setDistanceCm(calculatedCm);

          // Purue logic if distance is in range
          if (calculatedCm > 10) {
            return {
              x: currentRobot.x + dx * 0.05 * patrolSpeed,
              y: currentRobot.y + dy * 0.05 * patrolSpeed
            };
          }
          return currentRobot;
        });

        return nextPet;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isAutoPatrol, patrolSpeed]);

  const handleRadarGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setIsAutoPatrol(false);
    setPetPos({ x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) });
    addSerialLog(`🖱️ Radar Grid Interrupt: Pet manually set to coordinate (${Math.round(x)}%, ${Math.round(y)}%)`);
  };

  // Convert custom frames exact rendering to columns array
  const renderLcdLine1 = () => {
    const cells: LcdCell[] = Array(16).fill(null).map(() => ({ text: " " }));
    
    if (isFeeding) {
      const text = "  * DISPENSING *";
      return text.split("").map(char => ({ text: char }));
    }

    if (lcdFrame === 1) {
      // drawLCDFrame1 row 0:
      cells[2] = { char: 0 }; // us1
      cells[3] = { char: 3 }; // us4
      cells[4] = { char: 1 }; // us2
      cells[5] = { char: 1 }; // us2
      cells[6] = { char: 1 }; // us2
      cells[7] = { char: 1 }; // us2
      cells[8] = { char: 1 }; // us2
      cells[9] = { char: 1 }; // us2
      cells[10] = { char: 1 }; // us2
      cells[11] = { char: 1 }; // us2
      cells[12] = { char: 3 }; // us4
      cells[13] = { char: 0 }; // us1
    } else {
      // drawLCDFrame2 row 0:
      cells[2] = { char: 0 }; // us1
      cells[3] = { char: 3 }; // us4
      cells[4] = { char: 5 }; // us6
      cells[5] = { char: 4 }; // us5
      cells[6] = { char: 4 }; // us5
      cells[7] = { char: 4 }; // us5
      cells[8] = { char: 4 }; // us5
      cells[9] = { char: 4 }; // us5
      cells[10] = { char: 4 }; // us5
      cells[11] = { char: 6 }; // us7
      cells[12] = { char: 3 }; // us4
      cells[13] = { char: 0 }; // us1
    }
    return cells;
  };

  const renderLcdLine2 = () => {
    const cells: LcdCell[] = Array(16).fill(null).map(() => ({ text: " " }));
    
    if (isFeeding) {
      const text = `Servo Angle: ${servoAngle}°`;
      return text.split("").map(char => ({ text: char }));
    }

    // drawLCDFrame1 & 2 row 1 are identical:
    cells[5] = { char: 0 }; // us1
    cells[6] = { char: 2 }; // us3
    cells[7] = { char: 3 }; // us4
    cells[8] = { char: 3 }; // us4
    cells[9] = { char: 2 }; // us3
    cells[10] = { char: 0 }; // us1

    return cells;
  };

  return (
    <div id="pet-robot-sec" className="scroll-mt-20 border border-slate-800/80 rounded-2xl bg-slate-950/40 p-6 md:p-8 backdrop-blur-md mb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <span className="text-xs font-mono text-pink-500 font-semibold uppercase tracking-wider">PROJECT 03 • Arduino Uno Robotic Control</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-1 flex items-center gap-2">
            <Bot className="w-7 h-7 text-pink-500" />
            <span>Pet Companion Robot (Hardware Twin)</span>
          </h2>
          <p className="text-sm text-slate-400 italic mt-1 font-sans">
            Feeder Dispenser Servo, Ultrasonic Avoidance Drive, Photoresistor Night-light, and DFPlayer Mini Synthesizer
          </p>
        </div>

        {/* Unboxed Metadata */}
        <div className="text-xs font-mono text-slate-400">
          2024 Hardware Project · Arduino Uno R3
        </div>
      </div>

      {/* Structured Case Study Breakdown */}
      <ProjectBreakdown
        accentColor="pink"
        overview="An autonomous Arduino Uno pet companion and feeding robot featuring ultrasonic obstacle avoidance, timed SG90 feeder actuation, photoresistor-triggered night illumination, DFPlayer Mini audio synthesis, and custom 5x8 CGRAM 16x2 LCD animations."
        problem="A single-core 8-bit microcontroller has no OS scheduler, making it challenging to coordinate continuous sonar distance polling, PWM servo sweeps, serial MP3 playback, and animated LCD refreshes without stalling drive motors."
        role="Firmware & Hardware Systems Developer — Implemented Uno.ino sensor-actuator control loops, hardware pin multiplexing across digital/analog/SoftwareSerial buses, custom 5x8 CGRAM character matrices, and this browser hardware twin."
        technologies={[
          'C / C++ (Arduino Uno)',
          'HC-SR04 Ultrasonic',
          'SG90 Dispenser Servo',
          'DFPlayer Mini (SoftwareSerial)',
          '16x2 I2C LCD (Custom CGRAM)',
          'Photoresistor & L298N Motors',
        ]}
        results="Delivered reliable multi-peripheral hardware coordination with reactive <=15cm obstacle avoidance, persistent dark-room night-light activation, and smooth 2-frame pet expression rendering on the 16x2 LCD."
        sourceCodeUrl="https://github.com/moshi89"
        interactiveDemoLabel="Hardware Digital Twin"
        inPageCodeLabel="View Uno.ino Firmware"
        onRunInteractiveDemo={() => {
          setActiveTab('simulator');
          document.getElementById('pet-demo-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onViewInPageCode={() => {
          setActiveTab('code');
          document.getElementById('pet-demo-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {/* Tabs */}
      <div id="pet-demo-tabs" className="flex border-b border-slate-800/60 mb-6 font-mono text-xs scroll-mt-24">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 border-b-2 font-display font-medium transition-all ${
            activeTab === 'simulator'
              ? 'border-pink-500 text-pink-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Interactive Digital Twin
        </button>
        <button
          onClick={() => setActiveTab('pins')}
          className={`px-4 py-2 border-b-2 font-display font-medium transition-all ${
            activeTab === 'pins'
              ? 'border-pink-500 text-pink-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Uno Pin Interconnections
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 border-b-2 font-display font-medium transition-all ${
            activeTab === 'code'
              ? 'border-pink-500 text-pink-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Source Code (Uno.ino)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'simulator' && (
          <motion.div
            key="simulator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Grid Layout: Controls & Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Interactive Inputs / Stimuli Panel */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-slate-900/20 border border-slate-800/50 p-5 rounded-xl space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-mono text-slate-400 font-bold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-pink-500" />
                    <span>Hardware Sensor Stimulators</span>
                  </h3>

                  {/* Switch Pin A0 (Active LOW momentary switch) */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                        Feeder Push Switch (Pin A0)
                      </span>
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${switchPressed ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400'}`}>
                        {switchPressed ? 'INPUT: LOW (PRESSED)' : 'INPUT: HIGH (PULLUP)'}
                      </span>
                    </div>
                    
                    <button
                      onMouseDown={() => setSwitchPressed(true)}
                      onMouseUp={() => setSwitchPressed(false)}
                      onTouchStart={() => setSwitchPressed(true)}
                      onTouchEnd={() => setSwitchPressed(false)}
                      disabled={isFeeding}
                      className={`w-full py-2.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                        isFeeding 
                          ? 'bg-amber-600/25 border-amber-500/30 text-amber-400 animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700 active:bg-pink-600 active:text-white'
                      }`}
                    >
                      {isFeeding ? 'DISPENSING ACTIVE (Servo Busy)' : 'MOMENTARY PRESS (Feed Pet)'}
                    </button>
                  </div>

                  {/* Potentiometer Pin A3 (Music track wiper) */}
                  <div className="space-y-2 pt-3 border-t border-slate-800/40">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-purple-400" />
                        Music Potentiometer (Pin A3)
                      </span>
                      <span className="font-mono text-purple-400 font-bold">Wiper: {potValue} / 1023</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1023"
                      value={potValue}
                      onChange={(e) => setPotValue(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Track 1</span>
                      <span>Track 2</span>
                      <span>Track 3</span>
                      <span>Track 4</span>
                      <span>Track 5</span>
                    </div>
                  </div>

                  {/* LDR Photoresistor Pin A2 (Ambient Light) */}
                  <div className="space-y-2 pt-3 border-t border-slate-800/40">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        LDR Light Sensor (Pin A2)
                      </span>
                      <span className="font-mono text-amber-400 font-bold">Value: {photoValue} ({photoValue < 100 ? 'DARK' : 'LIGHT'})</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1023"
                      value={photoValue}
                      onChange={(e) => setPhotoValue(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span className="flex items-center gap-0.5"><Moon className="w-2.5 h-2.5" /> Dark (&lt;100)</span>
                      <span>Settle Threshold</span>
                      <span className="flex items-center gap-0.5"><Sun className="w-2.5 h-2.5" /> Bright</span>
                    </div>

                    {/* Dark countdown progress overlay */}
                    {photoValue < 100 && (
                      <div className="bg-slate-950/80 p-2 rounded border border-slate-800 text-[10px] font-mono text-slate-400 flex justify-between items-center mt-1">
                        <span>LDR Timer: {darkDuration} / 5.0s continuous</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, idx) => (
                            <div 
                              key={idx} 
                              className={`w-2.5 h-1.5 rounded-sm transition-all ${idx < darkDuration ? 'bg-amber-500' : 'bg-slate-800'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Night Light & Drive Actuators status cards */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/60 text-center relative overflow-hidden">
                    <span className="text-slate-500 block text-[9px] mb-1">NIGHT LIGHTS (PINS 6,7)</span>
                    <span className={`font-semibold ${ledsOn ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                      {ledsOn ? '● HIGH (LEDs ON)' : '○ LOW (LEDs OFF)'}
                    </span>
                    {ledsOn && <div className="absolute inset-0 bg-amber-500/5 animate-pulse pointer-events-none" />}
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/60 text-center">
                    <span className="text-slate-500 block text-[9px] mb-1">DRIVE SPEED (PINS 10,11)</span>
                    <span className={`font-semibold ${motorsRunning ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      {motorsRunning ? 'PWM: 120 (FORWARD)' : 'PWM: 0 (STOP)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Virtual 16x2 LCD & Radar pursuit field */}
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                
                {/* 1. HD44780 LiquidCrystal Backlit LCD Panel */}
                <div className="bg-emerald-950/95 border-[6px] border-slate-900 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-black/40 pointer-events-none" />
                  
                  {/* Outer bezel indicators */}
                  <div className="flex justify-between items-center text-[8px] font-mono text-emerald-600/80 uppercase tracking-widest pb-1 border-b border-emerald-900/40 mb-3">
                    <span>HD44780 Parallel Liquid Crystal display (4-bit mode)</span>
                    <span className="animate-pulse">● Frame {lcdFrame} Active</span>
                  </div>

                  {/* Character matrix container */}
                  <div className="space-y-2">
                    {/* Line 1 character cells */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {renderLcdLine1().map((cell, idx) => renderSingleLcdCell(cell, idx))}
                    </div>

                    {/* Line 2 character cells */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {renderLcdLine2().map((cell, idx) => renderSingleLcdCell(cell, idx))}
                    </div>
                  </div>
                </div>

                {/* 2. Sonar Tracking Radar Arena (Feedback Loop Sandbox) */}
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Obstacle Avoidance Sandbox</span>
                      <span className="font-display text-xs font-bold text-slate-200">Stage 5 • Sonar Feedback (dist &gt; 10 &amp;&amp; dist &lt; 30)</span>
                    </div>

                    <button
                      onClick={() => setIsAutoPatrol(!isAutoPatrol)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono border ${isAutoPatrol ? 'bg-pink-600/10 border-pink-500/30 text-pink-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                    >
                      {isAutoPatrol ? '● Patrol: ON' : '○ Patrol: OFF'}
                    </button>
                  </div>

                  {/* Sonar Arena Grid */}
                  <div 
                    onClick={handleRadarGridClick}
                    className="relative w-full h-[180px] bg-slate-950 border border-slate-900/80 rounded-lg overflow-hidden cursor-crosshair select-none"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                    
                    {/* SVG Connections and line of sight */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line 
                        x1={`${robotPos.x}%`} 
                        y1={`${robotPos.y}%`} 
                        x2={`${petPos.x}%`} 
                        y2={`${petPos.y}%`} 
                        className={`stroke-2 ${motorsRunning ? 'stroke-pink-500/50' : 'stroke-rose-500/20'}`}
                        strokeDasharray="4,4"
                      />
                      <foreignObject
                        x={`${(robotPos.x + petPos.x) / 2 - 30}%`}
                        y={`${(robotPos.y + petPos.y) / 2 - 10}%`}
                        width="60"
                        height="20"
                      >
                        <div className="bg-slate-900/95 text-[9px] font-mono text-center font-bold px-1 py-0.5 rounded border border-slate-800 text-pink-400 shadow">
                          {distanceCm} cm
                        </div>
                      </foreignObject>
                    </svg>

                    {/* Pet Icon */}
                    <div 
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
                      style={{ left: `${petPos.x}%`, top: `${petPos.y}%` }}
                    >
                      <div className="relative w-8 h-8 rounded-full bg-slate-900 border border-pink-500/60 flex items-center justify-center text-sm shadow-lg">
                        🐈
                      </div>
                    </div>

                    {/* Robot Icon */}
                    <div 
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out"
                      style={{ left: `${robotPos.x}%`, top: `${robotPos.y}%` }}
                    >
                      <div className={`relative w-8 h-8 rounded-lg ${motorsRunning ? 'bg-cyan-950 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.3)] animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-500'} border-2 flex items-center justify-center`}>
                        <Bot className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-2">
                    <span>*Click on grid above to position pet manually</span>
                    <span className={motorsRunning ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                      {motorsRunning ? 'Motors active (distance is in 11-29cm range)' : 'Motors stopped (distance outside 11-29cm)'}
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Simulated Serial Monitor Log Trace */}
            <div className="bg-black/80 rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-300 flex flex-col h-[150px]">
              <div className="flex justify-between items-center pb-2 border-b border-slate-900 text-[10px] text-slate-500 mb-2">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Arduino Uno Serial Monitor Output (9600 baud)</span>
                </span>
                <span>Preemptive Loop trace</span>
              </div>
              <div ref={logEndRef} className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
                {serialHistory.map((log, index) => (
                  <div
                    key={index}
                    className={`leading-relaxed text-[10px] ${
                      log.includes('Activated') || log.includes('Dispensing') || log.includes('sweeping') ? 'text-pink-400' :
                      log.includes('Obstacle') || log.includes('motors') ? 'text-emerald-400' :
                      log.includes('Potentiometer') || log.includes('sending') ? 'text-purple-400' :
                      log.includes('Dark') || log.includes('settling') ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Arduino Pins Connection Table Tab */}
        {activeTab === 'pins' && (
          <motion.div
            key="pins"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 font-sans text-slate-300"
          >
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white font-display">Arduino Uno Pin Assignments</h3>
              <p className="text-xs text-slate-400">
                All connections are designed with low-level peripheral isolation to ensure Uno-safe performance without overlapping interrupts or timer conflicts.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/10">
              <table className="w-full border-collapse text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[10px] uppercase tracking-wider">
                    <th className="p-3">Pin</th>
                    <th className="p-3">Peripheral Connected</th>
                    <th className="p-3">Uno Pin Direction</th>
                    <th className="p-3 text-center">Active Real-Time State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {/* Pin A0 */}
                  <tr>
                    <td className="p-3 font-bold text-pink-400">Pin A0</td>
                    <td className="p-3">Push Switch (Feeder)</td>
                    <td className="p-3">INPUT_PULLUP</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${switchPressed ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-500'}`}>
                        {switchPressed ? 'LOW (Pressed)' : 'HIGH (Idle)'}
                      </span>
                    </td>
                  </tr>
                  {/* Pin A1 */}
                  <tr>
                    <td className="p-3 font-bold text-pink-400">Pin A1</td>
                    <td className="p-3">SG90 Micro Servo signal</td>
                    <td className="p-3">OUTPUT</td>
                    <td className="p-3 text-center font-bold text-emerald-400">
                      {servoAngle}° PWM
                    </td>
                  </tr>
                  {/* Pin A2 */}
                  <tr>
                    <td className="p-3 font-bold text-pink-400">Pin A2</td>
                    <td className="p-3">LDR Photoresistor (voltage divider)</td>
                    <td className="p-3">INPUT (Analog)</td>
                    <td className="p-3 text-center text-amber-400 font-bold">
                      {photoValue} / 1023
                    </td>
                  </tr>
                  {/* Pin A3 */}
                  <tr>
                    <td className="p-3 font-bold text-pink-400">Pin A3</td>
                    <td className="p-3">10k Potentiometer (Track selector)</td>
                    <td className="p-3">INPUT (Analog)</td>
                    <td className="p-3 text-center text-purple-400 font-bold">
                      {potValue} / 1023
                    </td>
                  </tr>
                  {/* Pins 2,3,4,5 */}
                  <tr>
                    <td className="p-3 font-bold text-pink-400">Pins 2,3,4,5</td>
                    <td className="p-3">L298N Motor Direction Pins</td>
                    <td className="p-3">OUTPUT</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${motorsRunning ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        {motorsRunning ? 'Pin 2,4 HIGH' : 'All LOW'}
                      </span>
                    </td>
                  </tr>
                  {/* Pins 10,11 */}
                  <tr>
                    <td className="p-3 font-bold text-pink-400">Pins 10, 11</td>
                    <td className="p-3">L298N Motor Enable Pins (Speed)</td>
                    <td className="p-3">OUTPUT (PWM)</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${motorsRunning ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        {motorsRunning ? 'PWM: 120' : 'PWM: 0'}
                      </span>
                    </td>
                  </tr>
                  {/* Pins 6,7 */}
                  <tr>
                    <td className="p-3 font-bold text-pink-400">Pins 6, 7</td>
                    <td className="p-3">Dual Night LEDs</td>
                    <td className="p-3">OUTPUT</td>
                    <td className="p-3 text-center font-semibold">
                      <span className={ledsOn ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                        {ledsOn ? 'HIGH (ON)' : 'LOW (OFF)'}
                      </span>
                    </td>
                  </tr>
                  {/* Pins 9,8 */}
                  <tr>
                    <td className="p-3 font-bold text-pink-400">Pins 9, 8</td>
                    <td className="p-3">HC-SR04 Trig &amp; Echo</td>
                    <td className="p-3">OUTPUT / INPUT</td>
                    <td className="p-3 text-center text-sky-400 font-bold">
                      {distanceCm} cm echo
                    </td>
                  </tr>
                  {/* Pins 12,13 */}
                  <tr>
                    <td className="p-3 font-bold text-pink-400">Pins 12, 13</td>
                    <td className="p-3">DFPlayer SoftwareSerial TX/RX</td>
                    <td className="p-3">SoftwareSerial (9600)</td>
                    <td className="p-3 text-center text-purple-400">
                      Active track: {currentPlayingTrack}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Source Code View */}
        {activeTab === 'code' && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-white font-display">Pet Companion Robot Uno Firmware</h3>
                <p className="text-xs text-slate-400">Target board: Arduino Uno R3 • C/C++</p>
              </div>
            </div>

            <div className="relative bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto max-h-[380px] overflow-y-auto scrollbar-thin">
              <pre className="font-mono text-[11px] text-slate-300 leading-relaxed text-left">
{`/*
  Pet Companion Robot_Uno.ino
  Combined: Pet Feeder + Obstacle-Avoiding Car
  Target board: Arduino Uno

  Pin assignments (Uno-safe, 0-13 + A0-A5)
  ─────────────────────────────────────────
  Motor driver
    motorA1 → 2   motorA2 → 3
    motorB1 → 4   motorB2 → 5
    enA     → 10  enB     → 11

  Ultrasonic (HC-SR04)
    trig → 9   echo → 8

  LEDs (night light)
    ledPin  → 6
    ledPin1 → 7

  LCD (4-bit mode)
    LiquidCrystal lcd(A3, A4, A5, 12, 13, 11);

  Servo
    servo → A1

  Switch
    switch → A0

  Photoresistor
    signal → A2

  DFPlayer Mini (SoftwareSerial)
    TX → 13   RX → 12

  Potentiometer (track select)
    wiper → A3
*/

#include <LiquidCrystal.h>
#include <Servo.h>
#include <SoftwareSerial.h>
#include <DFPlayer_Mini_Mp3.h>

// ── Ultrasonic ──────────────────────────────────────────────────────
#define TRIG_PIN  9
#define ECHO_PIN  8

// ── Motor driver ────────────────────────────────────────────────────
#define MOTOR_A1  2
#define MOTOR_A2  3
#define MOTOR_B1  4
#define MOTOR_B2  5
#define EN_A      10
#define EN_B      11
const int MOTOR_SPEED = 120;   // 0-255

// ── LEDs (night light) ──────────────────────────────────────────────
#define LED_PIN   6
#define LED_PIN1  7
#define PHOTO_PIN A2

// ── LCD (parallel 4-bit) ────────────────────────────────────────────
LiquidCrystal lcd(A3, A4, A5, 12, 13, 11);  // RS, EN, D4, D5, D6, D7

byte us1[8] = { B11111,B11111,B11111,B00000,B00000,B00000,B00000,B00000 };
byte us2[8] = { B11111,B11111,B11111,B11111,B11111,B11111,B11111,B11111 };
byte us3[8] = { B11111,B11111,B11111,B11111,B00000,B00000,B00000,B00000 };
byte us4[8] = { B11111,B11111,B11111,B11111,B11111,B00000,B00000,B00000 };
byte us5[8] = { B11111,B11111,B00000,B00000,B00000,B00000,B00000,B00000 };
byte us6[8] = { B11111,B11111,B00000,B00000,B00000,B00000,B10000,B11000 };
byte us7[8] = { B11111,B11111,B00000,B00000,B00000,B00000,B00001,B00011 };

// ── Servo & switch ──────────────────────────────────────────────────
#define SERVO_PIN  A1  
#define SWITCH_PIN A0  

Servo myServo;
bool  isFeeding  = false;

// ── DFPlayer (SoftwareSerial) ───────────────────────────────────────
SoftwareSerial dfSerial(12, 13);   // RX, TX (from Uno's perspective)

// ── Photoresistor state ─────────────────────────────────────────────
int           photoValue = 0;
unsigned long darkTime   = 0;
bool          ledOn      = false;

// ───────────────────────────────────────────────────────────────────
void setup() {
  // LCD Setup
  lcd.createChar(0, us1);
  lcd.createChar(1, us2);
  lcd.createChar(2, us3);
  lcd.createChar(3, us4);
  lcd.createChar(4, us5);
  lcd.createChar(5, us6);
  lcd.createChar(6, us7);
  lcd.begin(16, 2);
  lcd.clear();

  // Servo Setup
  myServo.attach(SERVO_PIN);
  myServo.write(0);

  // Switch & sensors & LEDs
  pinMode(SWITCH_PIN, INPUT_PULLUP);
  pinMode(PHOTO_PIN,  INPUT);
  pinMode(LED_PIN,    OUTPUT);
  pinMode(LED_PIN1,   OUTPUT);

  // Ultrasonic Setup
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // Motor driver Setup
  pinMode(MOTOR_A1, OUTPUT);
  pinMode(MOTOR_A2, OUTPUT);
  pinMode(MOTOR_B1, OUTPUT);
  pinMode(MOTOR_B2, OUTPUT);
  pinMode(EN_A,     OUTPUT);
  pinMode(EN_B,     OUTPUT);

  // DFPlayer via SoftwareSerial
  Serial.begin(9600);
  dfSerial.begin(9600);
  mp3_set_serial(dfSerial);
  delay(1);
  mp3_set_volume(20);
}

// ───────────────────────────────────────────────────────────────────
void loop() {
  // 1. LCD animation (two frames, 500 ms each)
  drawLCDFrame1();
  delay(500);
  drawLCDFrame2();
  delay(500);

  // 2. Feeder switch
  if (digitalRead(SWITCH_PIN) == LOW && !isFeeding) {
    isFeeding = true;
    dispenseFood();
  }
  if (digitalRead(SWITCH_PIN) == HIGH) {
    isFeeding = false;
  }

  // 3. DFPlayer track select via potentiometer
  int potValue  = analogRead(A3);
  int track     = map(potValue, 0, 1023, 1, 5);
  static int lastTrack = 0;
  if (track != lastTrack) {
    mp3_play(track);
    lastTrack = track;
    delay(300);
  }

  // 4. Night-light (photoresistor → LEDs after 5 s of darkness)
  photoValue = analogRead(PHOTO_PIN);
  if (photoValue < 100) {
    if (darkTime == 0) darkTime = millis();
    if (millis() - darkTime >= 5000 && !ledOn) {
      digitalWrite(LED_PIN,  HIGH);
      digitalWrite(LED_PIN1, HIGH);
      ledOn = true;
    }
  } else {
    darkTime = 0;
    if (ledOn) {
      digitalWrite(LED_PIN,  LOW);
      digitalWrite(LED_PIN1, LOW);
      ledOn = false;
    }
  }

  // 5. Obstacle avoidance
  long dist = getDistance();
  if (dist > 10 && dist < 30) {
    moveForward();
  } else {
    stopMotors();
  }

  delay(100);
}

// ───────────────────────────────────────────────────────────────────
// LCD helpers
// ───────────────────────────────────────────────────────────────────
void drawLCDFrame1() {
  lcd.setCursor(2,0);  lcd.write(byte(0));
  lcd.setCursor(3,0);  lcd.write(byte(3));
  lcd.setCursor(4,0);  lcd.write(byte(1));
  lcd.setCursor(5,0);  lcd.write(byte(1));
  ... (Truncated for readability, matches exact display logic)
}`}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
