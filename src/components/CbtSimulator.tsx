import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, CloudSun, Compass, RotateCcw, HelpCircle, FileVideo, ExternalLink, Languages, Heart, CheckCircle2, Camera, Upload, Image as ImageIcon, Smile, ArrowRight, Smartphone, Trash2, Battery, Wifi, ShieldAlert, Lightbulb } from 'lucide-react';
import { CognitiveDistortion, ActivitySuggestion } from '../types';
import ProjectBreakdown from './ProjectBreakdown';

import selfSketchImg from '../assets/images/self_image_sketch_1782867648441.jpg';

// High-fidelity pre-programmed thoughts for interactive demo
const THOUGHT_TEMPLATES = [
  {
    id: 't4',
    textEn: "Why hasn't there been a reply for 3 hours? They must be ignoring me or wanting to break off the relationship.",
    textKo: "답장이 왜 3시간째 안 올까? 날 무시하거나 관계를 끊고 싶어서 저러는 모양이다.",
    distortions: [
      { name: 'Mind Reading (독심술 오류)', description: 'Arbitrarily concluding that someone is reacting negatively to you without bother to check.', percentage: 75 },
      { name: 'Catastrophizing (파국화)', description: 'Blowing potential disappointment out of proportion and imagining extreme rejection.', percentage: 60 },
      { name: 'All-or-Nothing Thinking (흑백논리)', description: 'Viewing relationships as either completely perfect or totally broken.', percentage: 15 },
    ],
    socraticEn: "Has there been a time when a reply was delayed before? Was it really because they ignored you or wanted to cut ties?",
    socraticKo: "과거에도 답장이 늦었던 적이 있었나요? 그때도 정말 당신을 무시하거나 관계를 끊으려는 의도였나요?",
    weatherActivities: [
      {
        activity: "Oncheoncheon Cherry Walk (온천천 벚꽃길)",
        category: "Physical",
        weatherNeeded: "Sunny / Wind",
        description: "Walk along the Oncheoncheon water stream to physically ground yourself and release relational anxiety."
      }
    ]
  },
  {
    id: 't1',
    textEn: "I failed this homework, I will definitely fail this entire semester.",
    textKo: "이번 과제를 망쳤으니, 이번 학기 전체 학점도 완전히 망치게 될 거야.",
    distortions: [
      { name: 'Catastrophizing (파국화)', description: 'Expecting the absolute worst outcome regardless of reality.', percentage: 94 },
      { name: 'All-or-Nothing Thinking (흑백논리)', description: 'Viewing events in black-and-white categories with no middle ground.', percentage: 88 },
      { name: 'Emotional Reasoning (감정적 판단)', description: 'Believing that negative feelings reflect objective reality.', percentage: 42 },
    ],
    socraticEn: "Does a single assignment truly determine your full capability over several months? What evidence exists of your previous academic resilience?",
    socraticKo: "단 하나의 과제가 몇 달 동안 펼쳐질 당신의 전체 능력을 결정할까요? 과거에 일시적인 어려움을 극복하고 일어섰던 어떤 경험이 있으신가요?",
    weatherActivities: [
      {
        activity: "Oncheoncheon Walk (온천천 산책)",
        category: "Physical",
        weatherNeeded: "Sunny / Clear",
        description: "Take a 20-minute mindful walk along the Oncheoncheon stream pathway near PNU campus to physically activate your mood."
      },
      {
        activity: "Dawn Library Cozy Session (새벽벌 도서관)",
        category: "Cognitive",
        weatherNeeded: "Rainy / Cold",
        description: "Find a quiet desk inside PNU Dawn Library, listen to the rain, and read a single chapter of a book without pressure."
      }
    ]
  },
  {
    id: 't2',
    textEn: "My teammates are doing all the heavy lifting in this project, I'm totally useless.",
    textKo: "팀원들이 어려운 작업을 다 해결하고 있어, 나는 팀에 전혀 쓸모없는 존재인 것 같아.",
    distortions: [
      { name: 'Personalization (개인화)', description: 'Holding yourself personally responsible for events not entirely under your control.', percentage: 91 },
      { name: 'All-or-Nothing Thinking (흑백논리)', description: 'Rating yourself as a complete failure due to feeling less skilled.', percentage: 76 },
      { name: 'Emotional Reasoning (감정적 판단)', description: 'Feeling helpless and assuming that emotion translates to actual uselessness.', percentage: 85 },
    ],
    socraticEn: "Are you overlooking your unique collaborative role, or assuming that struggle equates to incompetence? What is a small, concrete contribution you can coordinate with your team today?",
    socraticKo: "혹시 본인의 세심한 보조와 성실한 노력을 간과하고 계신 건 아닐까요? 오늘 당장 팀원들의 짐을 덜어줄 수 있는 작은 구체적 행동은 어떤 것이 있을까요?",
    weatherActivities: [
      {
        activity: "PNU North Gate Cafe Meeting (북문 카페 회의)",
        category: "Social",
        weatherNeeded: "Cloudy",
        description: "Invite a team member for a cup of coffee near PNU North Gate to discuss smaller tasks you can confidently own."
      },
      {
        activity: "Lo-Fi Virtual Coding sprint (가상 코딩 모임)",
        category: "Social",
        weatherNeeded: "Rainy",
        description: "Set up a shared, low-pressure virtual space with a lofi background to code secondary components together."
      }
    ]
  },
  {
    id: 't3',
    textEn: "If I don't win a prize at DACON 2026, my future career as a software engineer is ruined.",
    textKo: "이번 DACON 2026 디지털 경진대회에서 수상하지 못한다면 내 개발자 커리어는 끝장날 거야.",
    distortions: [
      { name: 'Catastrophizing (파국화)', description: 'Blowing potential failure out of proportion and imagining a ruined life.', percentage: 98 },
      { name: 'Should Statements (당위적 진술)', description: 'Imposing rigid expectations on yourself (\"I must win\").', percentage: 80 },
      { name: 'All-or-Nothing Thinking (흑백논리)', description: 'Seeing only two outcomes: supreme winner or complete failure.', percentage: 92 },
    ],
    socraticEn: "Is competition placement the sole pathway to a fulfilling engineering career, or is representing PNU on a national level a massive milestone in itself? What valuable technical skill are you sharpening right now?",
    socraticKo: "경진대회 수상이 유일한 개발자 성공의 문일까요, 아니면 부산대 대표로 무대에 서는 도전 자체가 이미 소중한 이정표일까요? 이 대회를 통해 성숙해지는 기술은 무엇인가요?",
    weatherActivities: [
      {
        activity: "Geumjeongsan Pine Trail (금정산 솔바람길)",
        category: "Physical",
        weatherNeeded: "Sunny / Windy",
        description: "Go up to Geumjeongsan Mountain trail behind PNU to clear your mental logs and appreciate the vast view."
      },
      {
        activity: "Creative Dev Sketching (디자인 구상)",
        category: "Reflective",
        weatherNeeded: "Any Weather",
        description: "Disconnect from the compiler for 30 minutes, and sketch layout diagrams or state machines on physical paper."
      }
    ]
  }
];

// Tailored Socratic Checkbox options and mature alternative thoughts matching the video and high fidelity
const D_SOCRATIC_DATA: Record<string, {
  questionKo: string;
  questionEn: string;
  choicesKo: string[];
  choicesEn: string[];
  matureThoughtsKo: string[];
  matureThoughtsEn: string[];
}> = {
  t4: {
    questionKo: "과거에도 답장이 늦었던 적이 있었나요? 그때도 정말 당신을 무시하거나 관계를 끊으려는 의도였나요?",
    questionEn: "Has there been a time when a reply was delayed before? Was it really because they ignored you or wanted to cut ties?",
    choicesKo: [
      "상대방이 중요한 회의 중이거나 업무에 집중하고 있을 수 있다.",
      "휴대폰 배터리가 없거나 무음 모드로 설정되어 확인하지 못했을 수 있다.",
      "메시지를 확인했지만 적절한 답변을 고민하느라 시간이 걸리고 있을 수 있다."
    ],
    choicesEn: [
      "The person might be in an important meeting or deeply focused on their current tasks.",
      "Their phone battery might have run out, or it is set to silent mode so they haven't noticed.",
      "They may have read the message but are taking time to formulate a thoughtful and appropriate response."
    ],
    matureThoughtsKo: [
      "3시간 정도 답장이 없는 것은 일상에서 흔히 일어날 수 있는 일이며, 이것이 곧 나의 가치나 관계의 끝을 의미하지는 않는다.",
      "상대방에게도 개인적인 사정이 있을 것이라 믿고, 내 할 일을 하며 여유 있게 기다려 보는 것이 좋겠다."
    ],
    matureThoughtsEn: [
      "Waiting three hours for a reply is an extremely common daily event and does not signify rejection or a broken bond.",
      "I trust that they have their own personal circumstances today, and I should confidently proceed with my own day's schedule."
    ]
  },
  t1: {
    questionKo: "이번 과제에서 만족스럽지 못한 점수를 받은 진짜 원인은 무엇일까요? 과거에도 한 과목 과제를 망쳤지만 전체 평점을 잘 관리했던 경험이 있으신가요?",
    questionEn: "What is the real objective reason for not getting the score you wanted? Have you ever had a bad assignment but still managed a good GPA?",
    choicesKo: [
      "과거에도 한 과목 과제를 망쳤지만 전체 학기 성적은 성실히 보완하여 우수하게 유지했던 적이 있다.",
      "이번 과제는 전체 배점 중 아주 일부분이므로 기말고사를 대비하면 충분히 만회할 수 있다.",
      "단발성 점수에 집착하여 '학기 전체를 망쳤다'고 생각하는 것은 과도한 비약이자 일시적 왜곡이다."
    ],
    choicesEn: [
      "I have had low scores on single assignments before, but consistently managed to recover my overall GPA by staying diligent.",
      "This assignment is only a minor fraction of the total grade, so preparing well for finals can easily compensate.",
      "Obsessing over a single grade and declaring 'the semester is ruined' is an extreme over-extrapolation."
    ],
    matureThoughtsKo: [
      "단 하나의 성적이 내 대학 생활과 역량을 모두 결정하지 않으며, 이 피드백을 바탕으로 기말고사에 적극 집중하겠다.",
      "부진한 점수는 배움과 오답 노트를 작성할 수 있는 좋은 이정표이자 기회가 된다."
    ],
    matureThoughtsEn: [
      "A temporary setback on one task does not define my academic capabilities or ruin my entire life's milestones.",
      "I will learn from the feedback, adapt my study patterns, and calmly direct my energy toward upcoming exams."
    ]
  },
  t2: {
    questionKo: "스스로가 팀에 '전혀 쓸모없다'고 느끼는 실제 증거가 있나요? 작더라도 그동안 팀 활동에 기여하거나 회의에 참석한 사실은 없나요?",
    questionEn: "Do you have actual factual evidence that you are 'entirely useless'? Are there really no contributions, meetings attended, or efforts?",
    choicesKo: [
      "팀원들이 경험이 많아 더 속도가 빠를 뿐, 내 성실한 태도와 학습 노력이 팀에 든든한 시너지가 된다.",
      "처음 접하는 기술 스택을 다루는 중이므로 속도가 느린 것은 아주 당연한 학습과 성장의 여정이다.",
      "내가 소스 코드 빌드 환경을 설정하거나 부가 문서 작업을 도운 것은 팀 전체 생산성에 확실히 일조했다."
    ],
    choicesEn: [
      "My teammates simply have more experience in this tech stack, but my diligent learning and research add reliable value to the team.",
      "We are working with a new tech stack; moving slowly at the beginning is a natural, expected phase of educational growth.",
      "Setting up project documentation or auxiliary scripts has directly freed up other developers and streamlined team efficiency."
    ],
    matureThoughtsKo: [
      "내가 지금 당장 모든 복잡한 코딩을 완벽히 소화하지 못하더라도, 내 몫을 성실히 다하며 한 걸음씩 성장하는 것 자체로 가치 있다.",
      "팀원들과 적극 소통하며 내가 기여할 수 있는 하위 태스크를 분담받아 책임감 있게 해결해 나가겠다."
    ],
    matureThoughtsEn: [
      "Struggling with advanced pieces does not make me a burden; I am a dedicated student collaborating to learn and help.",
      "I will communicate with transparency, own smaller modular components, and appreciate my growth journey."
    ]
  },
  t3: {
    questionKo: "경진대회 수상에 실패한 유능한 엔지니어들이 존재하나요? 수상 여부가 미래 커리어를 100% 보장하거나 가로막는 유일한 기준인가요?",
    questionEn: "Are there successful software developers who have lost hackathons or competitions? Is winning the only path to career success?",
    choicesKo: [
      "전 세계의 수많은 우수한 엔지니어들도 수많은 실패와 해커톤 탈락을 경험하며 단단하게 성장했다.",
      "경진대회 출전을 위해 설계하고 구현해 본 소스 코드와 배포 경험은 고스란히 귀중한 내 실무 포트폴리오가 된다.",
      "현업에서는 순위보다 협업 과정에서의 갈등 해결 능력과 제품을 완성해 보는 집요한 끈기를 더 가치 있게 평가한다."
    ],
    choicesEn: [
      "Most excellent developers worldwide have faced failures, rejected code reviews, and lost hacking tournaments.",
      "The actual system design, Git collaboration flow, and source code generated represent an extremely valuable, real portfolio.",
      "The industry values persistent problem-solving attitudes and complete delivery far more than static contest certificates."
    ],
    matureThoughtsKo: [
      "이번 디지털 경진대회 수상 여부에 목매기보다, 이 과정에서 겪는 시스템 한계 돌파 경험을 학습 자산으로 엮하겠다.",
      "내 장기적인 커리어는 단 일회성 대회의 등수로 좌우되지 않으며, 내가 매일 채워나가는 단단한 실력의 누적으로 완성된다."
    ],
    matureThoughtsEn: [
      "My future as a software engineer is built on steady project completions and architecture understanding, not single trophies.",
      "I will reframe this hackathon as a rich playground to test my clean code patterns and co-operative skills without fear."
    ]
  },
  custom: {
    questionKo: "이 걱정이 과연 100% 사실일까요? 지금 드는 부정적 생각이 객관적 미래를 보장하나요, 아니면 과도한 추측인가요?",
    questionEn: "Is this concern 100% true? Does this negative thought guarantee the future, or is it an over-speculation?",
    choicesKo: [
      "내 머릿속의 최악의 걱정은 실제 벌어질 현실적 결과와 일치하지 않는 경우가 훨씬 많다.",
      "이전에도 비슷한 불안이 있었지만, 나는 항상 유연하게 대처하며 문제를 잘 헤쳐 나왔다.",
      "지금 당장 내가 통제할 수 있는 구체적이고 작은 실천 사항에 집중하는 것이 훨씬 합리적이다."
    ],
    choicesEn: [
      "My worst mental worries rarely align with what actually happens in objective physical reality.",
      "I have faced similar anxieties in the past and have always managed to navigate through them successfully.",
      "It is much more productive to focus on small, actionable steps that I can actively control right now."
    ],
    matureThoughtsKo: [
      "일어날 법하지 않은 막연한 미래 불안감으로 오늘 하루를 낭비하지 않고, 나 자신을 따뜻하게 지지하며 한 걸음씩 나가겠다.",
      "상황은 언제나 해결책이 존재하며, 차분하게 이성을 찾으면 해결 가능한 작은 고리들이 보인다."
    ],
    matureThoughtsEn: [
      "I will not waste my day dwelling on remote possibilities; I will embrace myself and focus on current active goals.",
      "There are always alternative pathways; pausing to reflect will show me manageable solutions step by step."
    ]
  }
};

const SOCRATIC_STEPS: Record<string, { titleEn: string; titleKo: string; questionEn: string; questionKo: string; placeholderEn: string; placeholderKo: string }[]> = {
  t1: [
    {
      titleEn: "Step 1: Examine the Evidence",
      titleKo: "1단계: 객관적 증거 확인하기",
      questionEn: "What facts support the idea that you will fail the entire semester? What facts contradict this (e.g., past grades)?",
      questionKo: "이번 학기 전체를 망칠 것이라는 생각의 증거는 무엇인가요? 반대로 지금까지 지켜온 성실함이나 다른 과제 등 반박 증거는 무엇인가요?",
      placeholderEn: "Type evidence for and against...",
      placeholderKo: "생각을 뒷받침하는 증거와 반박하는 객관적 사실을 적어보세요..."
    },
    {
      titleEn: "Step 2: Alternative Explanations",
      titleKo: "2단계: 대안적 해석 찾기",
      questionEn: "What is a more realistic explanation for failing this single homework? (e.g., busy week, particularly difficult topic)?",
      questionKo: "이번 과제에서 만족스럽지 못한 점수를 받은 진짜 원인은 무엇일까요? (예: 과도한 일정, 난이도 높은 주제)",
      placeholderEn: "Type alternative reasons...",
      placeholderKo: "일어날 수 있는 다른 합리적인 이유들을 적어보세요..."
    },
    {
      titleEn: "Step 3: Decatastrophizing",
      titleKo: "3단계: 최악과 최선의 결과 (파국화 극복)",
      questionEn: "What is the absolute worst that could happen? How would you cope? What is the most realistic outcome?",
      questionKo: "일어날 수 있는 최악의 결과는 무엇이며 어떻게 대처할 수 있나요? 반대로 가장 현실적이고 무난한 결과는 무엇일까요?",
      placeholderEn: "Type worst vs realistic outcomes...",
      placeholderKo: "최악의 시나리오와 가장 일어날 법한 현실적인 시나리오를 비교해 보세요..."
    },
    {
      titleEn: "Step 4: Impact of the Thought",
      titleKo: "4단계: 이 생각의 실질적 영향 분석",
      questionEn: "What is the emotional cost of holding onto this thought? How would you feel if you changed your perspective?",
      questionKo: "'전체 학기를 망칠 것'이라는 생각이 당신의 하루에 미치는 영향은 무엇이며, 생각을 바꾼다면 어떤 긍정적 변화가 생길까요?",
      placeholderEn: "Type emotional cost vs benefits...",
      placeholderKo: "부정적인 생각에 갇혀 있을 때의 감정적 소모와, 생각을 고쳐먹었을 때 얻을 이점을 적어보세요..."
    },
    {
      titleEn: "Step 5: Formulate Alternative Thought",
      titleKo: "5단계: 균형 잡힌 대안적 생각 작성",
      questionEn: "Based on all your answers above, write a balanced and constructive alternative thought.",
      questionKo: "위의 답변들을 종합하여, 왜곡을 거치지 않은 가장 균형 잡히고 현실적인 대안의 생각을 최종 작성해 보세요.",
      placeholderEn: "Type your final balanced alternative thought...",
      placeholderKo: "마음을 편안하게 해주는 최종 대안 생각을 적어보세요..."
    }
  ],
  t2: [
    {
      titleEn: "Step 1: Examine the Evidence",
      titleKo: "1단계: 객관적 증거 확인하기",
      questionEn: "What evidence shows you are 'totally useless'? What tasks, coding help, or system discussion have you provided?",
      questionKo: "자신이 팀에 '전혀 쓸모없다'고 느끼는 구체적 증거가 있나요? 작더라도 그동안 팀 대화 참여나 준비 등 기여한 점은 없나요?",
      placeholderEn: "Type evidence for and against...",
      placeholderKo: "스스로를 무능하다고 생각하는 증거와, 실제 내가 기여했던 작은 노력을 비교해 적어보세요..."
    },
    {
      titleEn: "Step 2: Alternative Explanations",
      titleKo: "2단계: 대안적 해석 찾기",
      questionEn: "Are your teammates doing more because they have a specific technical background? Is learning part of cooperating?",
      questionKo: "팀원들이 작업을 더 많이 하는 이유가 그들의 경험 부족이 아닌 특정 분야 선행 학습 때문은 아닐까요? 팀프로젝트 또한 학습의 과정 아닐까요?",
      placeholderEn: "Type alternative perspectives...",
      placeholderKo: "내가 부족해서가 아니라, 역할 분담이나 배경지식의 차이에서 오는 합리적 이유를 적어보세요..."
    },
    {
      titleEn: "Step 3: Decatastrophizing",
      titleKo: "3단계: 최악과 최선의 결과 (파국화 극복)",
      questionEn: "If you are less experienced right now, does that make you a permanent failure? What can you learn from them?",
      questionKo: "지금 당장 코딩 속도가 느리다고 해서 그것이 내 평생의 무능함을 뜻하나요? 팀원들의 노하우를 배워 성장할 좋은 기회는 아닐까요?",
      placeholderEn: "Type growth mindset perspective...",
      placeholderKo: "팀원들과의 협업 속에서 내가 흡수하고 성장할 수 있는 현실적인 목표를 적어보세요..."
    },
    {
      titleEn: "Step 4: Impact of the Thought",
      titleKo: "4단계: 이 생각의 실질적 영향 분석",
      questionEn: "How does calling yourself 'totally useless' affect your confidence and your willingness to help the team today?",
      questionKo: "스스로 '쓸모없다'고 낙인찍는 것이 오늘 당신의 작업 동기와 실제 팀원들과의 소통에 어떤 영향을 주고 있나요?",
      placeholderEn: "Type thought impact...",
      placeholderKo: "이 부정적 수치심이 주는 부정적 영향과 극복 시 얻을 마음의 활력을 비교해 보세요..."
    },
    {
      titleEn: "Step 5: Formulate Alternative Thought",
      titleKo: "5단계: 균형 잡힌 대안적 생각 작성",
      questionEn: "Based on all your answers above, write a balanced alternative thought that values your efforts and team coordination.",
      questionKo: "앞선 자가 진단을 바탕으로, 팀에서의 기여와 성장을 함께 인정하는 따뜻하고 합리적인 새로운 생각을 적어보세요.",
      placeholderEn: "Type your final balanced alternative thought...",
      placeholderKo: "마음을 편안하게 해주는 최종 대안 생각을 적어보세요..."
    }
  ],
  t3: [
    {
      titleEn: "Step 1: Examine the Evidence",
      titleKo: "1단계: 객관적 증거 확인하기",
      questionEn: "Have successful software engineers ever lost hackathons or competitions? Is competition the only path to a software career?",
      questionKo: "성공한 개발자들이 대회의 모든 수상 경력을 가지고 있을까요? 대회 수상이 소프트웨어 엔지니어로 취업하고 성장하는 유일한 길인가요?",
      placeholderEn: "Type facts regarding career paths...",
      placeholderKo: "경진대회 수상 여부와 훌륭한 엔지니어가 되는 것의 실제 연관성에 대해 객관적으로 적어보세요..."
    },
    {
      titleEn: "Step 2: Alternative Explanations",
      titleKo: "2단계: 대안적 해석 찾기",
      questionEn: "What other valuable benefits does participating in DACON 2026 bring (e.g., project portfolio, Git collaboration, testing frameworks)?",
      questionKo: "DACON 2026 참가 자체만으로도 얻을 수 있는 가치(프로젝트 포트폴리오 구축, 팀원과의 Git 협업, 신기술 탐색 등)는 무엇이 있나요?",
      placeholderEn: "Type skills you are gaining...",
      placeholderKo: "상장 이외에 내가 이번 대회 코딩을 통해 직접 터득하고 있는 기술적 역량을 적어보세요..."
    },
    {
      titleEn: "Step 3: Decatastrophizing",
      titleKo: "3단계: 최악과 최선의 결과 (파국화 극복)",
      questionEn: "What is the most realistic outcome if you don't win a prize? (e.g., you still have a strong app to showcase, great learning).",
      questionKo: "만약 상을 타지 못한다면 내 인생이 끝장나나요? 아니면 여전히 멋진 어플리케이션 소스 코드와 배포 경험이 남아 자산이 되나요?",
      placeholderEn: "Type realistic outcomes...",
      placeholderKo: "탈락했을 때의 현실적인 결과와, 대회가 끝난 뒤에도 내가 쥘 수 있는 소중한 포트폴리오를 적어보세요..."
    },
    {
      titleEn: "Step 4: Impact of the Thought",
      titleKo: "4단계: 이 생각의 실질적 영향 분석",
      questionEn: "How does placing extreme 'all-or-nothing' pressure on yourself affect your sleep, cortisol, and coding focus?",
      questionKo: "'상을 타지 못하면 끝'이라는 극단적인 압박감이 당신의 수면 상태, 스트레스 수치, 그리고 코딩 집중력에 어떤 영향을 주나요?",
      placeholderEn: "Type stress and cognitive costs...",
      placeholderKo: "완벽주의적 압박감이 초래하는 번아웃 위험과, 부담을 내려놓았을 때의 즐거운 몰입감을 비교해 보세요..."
    },
    {
      titleEn: "Step 5: Formulate Alternative Thought",
      titleKo: "5단계: 균형 잡힌 대안적 생각 작성",
      questionEn: "Write a balanced alternative thought valuing the journey, engineering growth, and overall skill set.",
      questionKo: "이번 도전의 목표를 결과 지향이 아닌 과정과 배움 중심으로 리프레임한 건강한 새 다짐을 최종 작성해 보세요.",
      placeholderEn: "Type your final balanced alternative thought...",
      placeholderKo: "마음을 편안하게 해주는 최종 대안 생각을 적어보세요..."
    }
  ],
  custom: [
    {
      titleEn: "Step 1: Examine the Evidence",
      titleKo: "1단계: 객관적 증거 확인하기",
      questionEn: "What factual evidence supports this thought? What evidence contradicts it?",
      questionKo: "이 걱정스러운 생각이 사실이라는 구체적인 근거와, 이에 어긋나는 반대 증거는 무엇이 있나요?",
      placeholderEn: "Type evidence...",
      placeholderKo: "걱정을 뒷받침하는 사실과 그렇지 않은 합리적 사실을 적어보세요..."
    },
    {
      titleEn: "Step 2: Alternative Explanations",
      titleKo: "2단계: 대안적 해석 찾기",
      questionEn: "Is there an alternative, less threatening explanation for what is happening?",
      questionKo: "이 상황을 설명할 수 있는 더 긍정적이거나 평온한 대안 해석이 존재하나요?",
      placeholderEn: "Type alternative explanations...",
      placeholderKo: "상황을 다른 각도에서 해석할 수 있는 또 다른 원인들을 생각해 보세요..."
    },
    {
      titleEn: "Step 3: Decatastrophizing",
      titleKo: "3단계: 최악과 최선의 결과 (파국화 극복)",
      questionEn: "What is the worst that could happen, and how would you cope? What is the best and most likely outcome?",
      questionKo: "상황이 완전히 잘못되었을 때 일어날 수 있는 최악의 일과 그 해결 방안은 무엇이며, 가장 무난한 현실적 시나리오는 무엇인가요?",
      placeholderEn: "Type coping plans...",
      placeholderKo: "최악의 상황에 대한 유연한 대비책과, 안심할 수 있는 무난한 전개를 상상해 보세요..."
    },
    {
      titleEn: "Step 4: Impact of the Thought",
      titleKo: "4단계: 이 생각의 실질적 영향 분석",
      questionEn: "What are the consequences of believing this negative thought? What are the benefits of changing it?",
      questionKo: "이 불안한 생각을 계속 마음속에 품고 있을 때 발생하는 손실과, 이것을 리프레이밍했을 때 누리게 될 마음의 여유는 무엇일까요?",
      placeholderEn: "Type consequences vs benefits...",
      placeholderKo: "이 생각이 초래하는 정서적 손해와, 긍정적으로 수정했을 때 다가올 성장의 기쁨을 적어보세요..."
    },
    {
      titleEn: "Step 5: Formulate Alternative Thought",
      titleKo: "5단계: 균형 잡힌 대안적 생각 작성",
      questionEn: "Create a balanced, realistic, and compassionate alternative thought.",
      questionKo: "앞서 답한 내용을 정돈하여, 스스로를 위로하고 격려하면서도 상황을 객관적으로 담아낸 완성된 대안 문장을 작성해 보세요.",
      placeholderEn: "Type your alternative thought...",
      placeholderKo: "스스로에게 해줄 수 있는 가장 현명하고 고요한 대안 생각을 적어보세요..."
    }
  ]
};

export default function CbtSimulator() {
  const [isKorean, setIsKorean] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'info' | 'simulator'>('simulator');
  
  // 3 CBT Paths state
  const [activeCbtPath, setActiveCbtPath] = useState<'cognitive' | 'behavioral' | 'acceptance'>('cognitive');

  // Pillar 1: Cognitive States (Adaptive 4-step Wizard in a Mobile Frame)
  const [selectedThought, setSelectedThought] = useState<string>('t4');
  const [customThought, setCustomThought] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [simulatedResult, setSimulatedResult] = useState<typeof THOUGHT_TEMPLATES[0] | null>(null);

  // Video-aligned 4-step Mobile Wizard states
  const [mobStep, setMobStep] = useState<number>(0);
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
  const [selectedSocraticCheckboxes, setSelectedSocraticCheckboxes] = useState<number[]>([1, 2]); // prepopulate options 1 and 2
  const [selectedActionItem, setSelectedActionItem] = useState<string>('cognitive'); // cognitive, behavioral, acceptance
  const [savedWisdoms, setSavedWisdoms] = useState<{
    id: string;
    original: string;
    distortions: string[];
    logicLink: string;
    matureThoughts: string[];
  }[]>([
    {
      id: 'w1',
      original: "이번 과제를 망쳤으니, 이번 학기 전체 학점도 완전히 망치게 될 거야.",
      distortions: ["파국화 (Catastrophizing)", "흑백논리 (All-or-Nothing)"],
      logicLink: "과거에도 한 과목 과제를 망쳤지만 전체 학기 성적은 성실히 보완하여 우수하게 유지했던 적이 있다.",
      matureThoughts: [
        "단 세 번의 단발성 점수로 내 학업 능력을 깎아내릴 수 없으며, 다음 평가에 더 성실하게 집중하겠다.",
        "부진한 점수는 배움과 오답 노트를 작성할 수 있는 좋은 이정표가 된다."
      ]
    }
  ]);

  // Socratic Questioning Stepper Progress States (Fallback/Legacy compat)
  const [socraticStep, setSocraticStep] = useState<number>(0);
  const [socraticAnswers, setSocraticAnswers] = useState<Record<string, string[]>>({
    t4: ['', '', '', '', ''],
    t1: ['', '', '', '', ''],
    t2: ['', '', '', '', ''],
    t3: ['', '', '', '', ''],
    custom: ['', '', '', '', '']
  });

  // Pillar 2: Behavioral States
  const [selectedLocation, setSelectedLocation] = useState<'oncheoncheon' | 'beach' | 'mountain'>('oncheoncheon');
  const [isTrackingGps, setIsTrackingGps] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(0);

  const pathRef = useRef<SVGPathElement | null>(null);
  const [pointerPos, setPointerPos] = useState({ x: 30, y: 170 });

  const percentage = Math.min(100, (distanceKm / (selectedLocation === 'oncheoncheon' ? 2.5 : selectedLocation === 'beach' ? 4.5 : 5.0)) * 100);

  useEffect(() => {
    if (pathRef.current) {
      try {
        const totalLength = pathRef.current.getTotalLength() || 0;
        const point = pathRef.current.getPointAtLength((totalLength * percentage) / 100);
        setPointerPos({ x: point.x || 0, y: point.y || 0 });
      } catch (e) {
        // Fallback if browser/environment has standard path issues
      }
    }
  }, [percentage, selectedLocation]);

  // Pillar 3: Self-Acceptance States
  const [selectedImagePreset, setSelectedImagePreset] = useState<'sketch' | 'developer' | 'uploaded'>('sketch');
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [isScanningImage, setIsScanningImage] = useState<boolean>(false);
  const [showImageResult, setShowImageResult] = useState<boolean>(false);
  const [appearanceFeedback, setAppearanceFeedback] = useState<{en: string[], ko: string[]} | null>(null);

  // Preset positive feedback data for Pillar 3
  const PRESET_FEEDBACKS = {
    sketch: {
      en: [
        "Your gentle smile has an incredibly comforting and warm radiance that puts people at ease.",
        "Your posture reflects quiet grace, inner resilience, and high cognitive calmness.",
        "The sketch captures bright, thoughtful eyes that radiate intellectual focus and deep sincerity.",
        "There is a beautiful harmony between your natural creative spirit and professional determination.",
        "Your overall aura exudes a grounded, welcoming presence that brightens any academic setting."
      ],
      ko: [
        "부드러운 미소에서 마음에 평온을 주는 따뜻하고 밝은 온기가 전해집니다.",
        "차분하면서도 단단한 수용의 자세는 내면에 깃든 회복탄력성과 인내력을 보여줍니다.",
        "정밀하고 초롱초롱한 눈빛에서 깊이 있는 지적 탐구심과 성실함이 돋보입니다.",
        "지적인 매력과 예술적인 고감도 감성이 완벽한 예술적 조화를 이룹니다.",
        "차분하고 신뢰할 수 있는 아우라가 주변 동료들에게 안정감을 안겨주는 훌륭한 강점입니다."
      ]
    },
    developer: {
      en: [
        "You carry an exceptionally smart, professional, and confident aura that exudes leadership.",
        "Your bright and welcoming expression shows immense communicative warmth and collaborative team spirit.",
        "Your eyes represent a passionate Computer Science engineer, filled with curiosity, vision, and drive.",
        "A perfect balance of professional competence, approachability, and structured, logical focus.",
        "Your pleasant radiance speaks of a friendly guide and bright beacon within the university community."
      ],
      ko: [
        "대단히 스마트하고 전문적이면서도 상냥한 에너지가 돋보여, 차세대 리더의 자질이 묻어납니다.",
        "환하게 웃는 친근한 표정은 협업 능력과 팀원들에게 긍정적 영감을 주는 뛰어난 소통력을 증명합니다.",
        "빛나는 눈망울에서 컴퓨터공학을 이끌어갈 연구자다운 탐구열과 확고한 열정이 흘러넘칩니다.",
        "논리적인 정밀함과 부담감 없는 다정함이 조화롭게 공존하여 최적의 팀 허브 역할을 수행합니다.",
        "신뢰감을 주는 자신감 있는 자세가 보는 이들에게도 기분 좋은 확신을 심어줍니다."
      ]
    },
    uploaded: {
      en: [
        "This portrait captures a beautifully authentic and warm human presence that is uniquely yours.",
        "Your facial features project a rare combination of bright intelligence, kindness, and gentle focus.",
        "The photo radiates highly approachable, comforting, and supportive energy.",
        "You possess a natural, unforced confidence that speaks of deep focus and intellectual dedication.",
        "Your eyes carry a sincere and bright spark that communicates reliability, warmth, and hope."
      ],
      ko: [
        "이미지 전반에 걸쳐 당신만의 독창적이고 따뜻한 인간미가 아우라처럼 넓게 퍼져 있습니다.",
        "이목구비에서 고도로 발달한 지성과 다정한 온정이 함께 느껴져 깊은 호감을 선사합니다.",
        "사진 속에서 풍기는 다가가기 쉽고 포용력 있는 기운이 지친 마음을 위로해 줍니다.",
        "꾸밈없고 정직한 인상은 상대방에게 강력한 신뢰와 심리적 안정감을 전달합니다.",
        "생기 넘치고 맑은 안색에서 학문적 성취와 자아성찰의 깊이가 그대로 투영됩니다."
      ]
    }
  };

  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  // Trigger Socratic Inference
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      const preset = THOUGHT_TEMPLATES.find(t => t.id === selectedThought) || THOUGHT_TEMPLATES[0];
      setSimulatedResult(preset);
      return;
    }
    handleInference();
    setSocraticStep(0);
  }, [selectedThought]);

  const handleInference = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const preset = THOUGHT_TEMPLATES.find(t => t.id === selectedThought) || THOUGHT_TEMPLATES[0];
      setSimulatedResult(preset);
      setIsProcessing(false);
      setMobStep(1); // Auto-advance to scan report on selection change after first load
      setSelectedSocraticCheckboxes([1, 2]); // default prepopulated choices
    }, 850);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customThought.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const lower = customThought.toLowerCase();
      let matchedIndex = 0;
      if (lower.includes('fail') || lower.includes('시험') || lower.includes('망치')) {
        matchedIndex = 1;
      } else if (lower.includes('useless') || lower.includes('팀') || lower.includes('무능')) {
        matchedIndex = 2;
      } else if (lower.includes('수상') || lower.includes('dacon') || lower.includes('경진대회')) {
        matchedIndex = 3;
      } else {
        matchedIndex = 0; // default to reply delay (t4)
      }

      const template = THOUGHT_TEMPLATES[matchedIndex] || THOUGHT_TEMPLATES[0];
      setSimulatedResult({
        ...template,
        id: 'custom',
        textEn: customThought,
        textKo: customThought,
      });
      setSocraticStep(0);
      setIsProcessing(false);
      setMobStep(1); // Auto-advance to scan report for custom thoughts
      setSelectedSocraticCheckboxes([1, 2]); // default prepopulated choices
    }, 1000);
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImageSrc(reader.result as string);
        setSelectedImagePreset('uploaded');
        setShowImageResult(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Gemini Laser Scanner Animation
  const runImageAnalysis = () => {
    setIsScanningImage(true);
    setShowImageResult(false);
    setTimeout(() => {
      const fb = PRESET_FEEDBACKS[selectedImagePreset];
      setAppearanceFeedback(fb);
      setIsScanningImage(false);
      setShowImageResult(true);
    }, 1800);
  };

  // GPS Simulated Walk Timer & Distance Progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTrackingGps) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
        setDistanceKm(prev => {
          const maxDistance = activeCourse.targetDistance;
          if (prev >= maxDistance) {
            setIsTrackingGps(false);
            return maxDistance;
          }
          // Increments distance smoothly
          const stepKm = maxDistance / 30; // reaches goal in ~30 ticks (approx 7.5 seconds of fast simulator experience)
          const nextDist = Number((prev + stepKm).toFixed(2));
          if (nextDist >= maxDistance) {
            setIsTrackingGps(false);
            return maxDistance;
          }
          return nextDist;
        });
      }, 250); // fast update loop for satisfying visual progress
    }
    return () => clearInterval(interval);
  }, [isTrackingGps, selectedLocation]);

  const startGpsTracking = () => {
    setTimerSeconds(0);
    setDistanceKm(0);
    setIsTrackingGps(true);
  };

  const resetGpsTracking = () => {
    setIsTrackingGps(false);
    setTimerSeconds(0);
    setDistanceKm(0);
  };

  // Behavioral Activations Map Data
  const BEHAVIORAL_COURSES = {
    oncheoncheon: {
      titleEn: "Oncheoncheon Cherry Blossom Stream Walk",
      titleKo: "온천천 벚꽃 물길 마음 챙김 산책 코스",
      descEn: "A gentle walk right next to PNU, designed for physical grounding. Walk along the stream, synchronize your footsteps with rhythmic breaths, and feel the fresh air.",
      descKo: "부산대 정문 바로 앞을 흐르는 온천천 물길을 따라 걷는 코스입니다. 흐르는 물소리에 집중하며 한 걸음마다 부정적 잡념을 씻어내어 신체를 활성화합니다.",
      targetDistance: 2.5,
      coords: { lat: 35.2312, lng: 129.0835 },
      path: "M 30,170 Q 70,120 110,130 T 190,100 T 270,140 T 350,90",
    },
    beach: {
      titleEn: "Haeundae Coastal Horizon Perspective Shift",
      titleKo: "해운대 수평선 끝없는 관점 전환 코스",
      descEn: "Escape to Busan's ocean horizon. Feel the expansive perspective, breathe the cool marine salt air, and let the ocean waves dissolve your cognitive tightness.",
      descKo: "부산의 드넓은 바다 수평선을 바라보며 시야를 물리적으로 넓히는 코스입니다. 끝없는 해안선을 걸으며 마음의 안정을 찾습니다.",
      targetDistance: 4.5,
      coords: { lat: 35.1587, lng: 129.1603 },
      path: "M 20,150 C 80,150 140,140 200,100 C 260,60 320,110 380,80",
    },
    mountain: {
      titleEn: "Geumjeongsan Pine Forest Air Bathing",
      titleKo: "금정산 소나무 솔바람 숲 치유 코스",
      descEn: "Hike up the peaceful pine tree path directly behind PNU campus. Feel the deep earthy pine aroma, touch the rough tree bark, and release stress via physical climbing energy.",
      descKo: "부산대학교 캠퍼스 뒷산인 금정산 솔바람길을 따라 피톤치드를 호흡하는 코스입니다. 울창한 소나무 숲길을 오르며 심폐 기능을 자극하고 에너지를 북돋습니다.",
      targetDistance: 5.0,
      coords: { lat: 35.2442, lng: 129.0812 },
      path: "M 40,180 L 100,120 L 180,140 L 240,80 L 320,110 L 360,50",
    }
  };

  const activeCourse = BEHAVIORAL_COURSES[selectedLocation];
  const socraticDataForThought = D_SOCRATIC_DATA[simulatedResult?.id === 'custom' ? 'custom' : (selectedThought || 't4')] || D_SOCRATIC_DATA['t4'];

  return (
    <div id="cbt-companion" className="scroll-mt-20 border border-slate-800/80 rounded-2xl bg-slate-950/40 p-6 md:p-8 backdrop-blur-md mb-12">
      {/* Header section with category and quick badges */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">PROJECT 01 • Android Mental Health</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-1 flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-400" />
            <span>Clinical CBT Companion App</span>
          </h2>
          <p className="text-sm text-slate-400 italic mt-1 font-sans">
            "What troubles us is not situations themselves, but the way we think about them." — Epictetus
          </p>
        </div>

        {/* Language switcher */}
        <div className="flex flex-wrap gap-2.5 items-center w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsKorean(!isKorean)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-all ml-auto md:ml-0 cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <span>{isKorean ? 'English' : '한국어'}</span>
          </button>
        </div>
      </div>

      {/* Structured Case Study Breakdown */}
      <ProjectBreakdown
        accentColor="indigo"
        overview={
          isKorean
            ? '온디바이스 경량 NLP 모델(XLM-RoBERTa)로 인지 왜곡을 즉시 분류하고, Gemini 기반 소크라테스식 질문 대화, GPS/날씨 연동 행동 활성화, 자기 수용 이미지 피드백을 통합한 오프라인 우선 안드로이드 CBT 동반자 앱입니다.'
            : 'An offline-first Android mental health companion combining quantized on-device NLP (XLM-RoBERTa) for cognitive distortion detection with Gemini Socratic reframing, GPS/weather-aware behavioral activation, and self-acceptance visual feedback.'
        }
        problem={
          isKorean
            ? '기존 클라우드 전용 AI 상담 앱은 네트워크 지연, API 트래픽 비용 증가, 오프라인 환경에서의 서비스 중단 및 메인 UI 스레드(ANR) 정지 문제를 겪습니다.'
            : 'Server-only mental health AI apps suffer from network latency, recurring API costs, complete failure offline, and UI thread blocking (ANR) during heavy inference.'
        }
        role={
          isKorean
            ? 'Android & 온디바이스 ML 리드 개발 — Kotlin Jetpack Compose MVVM 아키텍처 설계, XLM-RoBERTa(ONNX) 경량 추론 연동, Coroutines(Dispatchers.IO) 비동기 분리 및 로컬 fallback 엔진 구현.'
            : 'Lead Android & On-Device ML Engineer — Designed Kotlin Jetpack Compose MVVM architecture, integrated quantized XLM-RoBERTa (ONNX), isolated inference on Dispatchers.IO, and built the offline fallback engine.'
        }
        technologies={[
          'Kotlin',
          'Jetpack Compose',
          'Coroutines (MVVM)',
          'XLM-RoBERTa (PyTorch -> ONNX)',
          'Gemini API',
          'OpenWeatherMap & GPS',
          'DataStore',
        ]}
        results={
          isKorean
            ? '로컬 인지 왜곡 분류 밀리초 단위 달성, UI 정지(ANR) 0ms 유지, 외부 API 장애 시에도 100% 무중단 규칙 기반 로컬 폴백(fallbackAnalysisService)으로 안정적인 임상 워크플로우를 확보했습니다.'
            : 'Achieved millisecond-level local cognitive distortion classification with 0ms UI lag, state persistence across process deaths via DataStore, and uninterrupted offline operation via rule-based fallback.'
        }
        videoDemoUrl="https://drive.google.com/file/d/1GGbE4aCxzA_Exm_odgWtZXrGz6paWxOI/view?usp=sharing"
        videoDemoLabel="Google Drive Video Demo"
        sourceCodeUrl="https://github.com/moshi89"
        interactiveDemoLabel={isKorean ? '라이브 시뮬레이터 실행' : 'Interactive Simulator'}
        inPageCodeLabel={isKorean ? '기술 아키텍처 명세' : 'Technical Architecture'}
        onRunInteractiveDemo={() => {
          setActiveTab('simulator');
          document.getElementById('cbt-demo-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onViewInPageCode={() => {
          setActiveTab('info');
          document.getElementById('cbt-demo-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {/* Primary Tabs */}
      <div id="cbt-demo-tabs" className="flex border-b border-slate-800/60 mb-6 scroll-mt-24">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 border-b-2 font-display text-sm font-medium transition-all ${
            activeTab === 'simulator'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          {isKorean ? 'CBT 3대 치료 모듈 라이브 데모' : 'CBT 3 Pillars Live Demo'}
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 border-b-2 font-display text-sm font-medium transition-all ${
            activeTab === 'info'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          {isKorean ? '프로젝트 구조 및 기술 명세' : 'Technical Specifications'}
        </button>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'simulator' ? (
          <motion.div
            key="simulator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* 3 Pillars Selector Navigation Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setActiveCbtPath('cognitive');
                  setShowImageResult(false);
                }}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  activeCbtPath === 'cognitive'
                    ? 'bg-indigo-950/30 border-indigo-500/50 text-white shadow-lg shadow-indigo-950/40'
                    : 'bg-slate-900/20 border-slate-800/60 text-slate-400 hover:bg-slate-900/40 hover:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeCbtPath === 'cognitive' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold tracking-wider text-indigo-400">PILLAR 1</div>
                  <div className="text-sm font-semibold font-display">{isKorean ? '인지 왜곡 리프레이밍' : 'Cognitive Restructuring'}</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveCbtPath('behavioral');
                  setShowImageResult(false);
                }}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  activeCbtPath === 'behavioral'
                    ? 'bg-cyan-950/30 border-cyan-500/50 text-white shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-900/20 border-slate-800/60 text-slate-400 hover:bg-slate-900/40 hover:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeCbtPath === 'behavioral' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold tracking-wider text-cyan-400">PILLAR 2</div>
                  <div className="text-sm font-semibold font-display">{isKorean ? '위치 기반 행동 활성화' : 'Behavioral Activation'}</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveCbtPath('acceptance');
                }}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  activeCbtPath === 'acceptance'
                    ? 'bg-pink-950/30 border-pink-500/50 text-white shadow-lg shadow-pink-950/40'
                    : 'bg-slate-900/20 border-slate-800/60 text-slate-400 hover:bg-slate-900/40 hover:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeCbtPath === 'acceptance' ? 'bg-pink-500/20 text-pink-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold tracking-wider text-pink-400">PILLAR 3</div>
                  <div className="text-sm font-semibold font-display">{isKorean ? '자기 수용 자존감 강화' : 'Self-Acceptance Image'}</div>
                </div>
              </button>
            </div>

            {/* Path Content Boxes */}
            <div className="p-0.5">
              {/* Path 1: Cognitive Restructuring */}
              {activeCbtPath === 'cognitive' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                  
                  {/* Left Column: CBT Sanctuary Simulated Mobile Phone Device */}
                  <div className="lg:col-span-6 flex flex-col items-center">
                    <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider mb-3 block">
                      📱 CBT SANCTUARY INTERACTIVE MOBILE DEV
                    </span>
                    
                    {/* Outer Phone Frame */}
                    <div className="relative w-full max-w-[340px] aspect-[9/18.5] rounded-[48px] border-[10px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col justify-between p-1.5 ring-4 ring-slate-900/60 ring-offset-2 ring-offset-slate-950">
                      
                      {/* Left side physical buttons */}
                      <div className="absolute left-[-13px] top-24 w-[3px] h-10 bg-slate-800 rounded-l" />
                      <div className="absolute left-[-13px] top-38 w-[3px] h-14 bg-slate-800 rounded-l" />
                      {/* Right side power button */}
                      <div className="absolute right-[-13px] top-28 w-[3px] h-12 bg-slate-800 rounded-r" />

                      {/* Top Camera Punch hole & Status Bar */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
                      </div>

                      {/* Screen Status Bar Details */}
                      <div className="absolute top-1 left-0 right-0 px-6 pt-1 flex justify-between items-center text-[10px] font-mono font-medium text-slate-400 z-20 select-none">
                        <span>10:00 AM</span>
                        <div className="flex items-center gap-1">
                          <Wifi className="w-3 h-3 text-slate-400" />
                          <span className="text-[9px]">5G</span>
                          <Battery className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                          <span className="text-[8px] text-emerald-400">100%</span>
                        </div>
                      </div>

                      {/* Main Mobile Screen Wrapper */}
                      <div className="flex-1 bg-gradient-to-b from-slate-900 to-slate-950 rounded-[38px] p-4 pt-8 pb-4 flex flex-col justify-between overflow-y-auto overflow-x-hidden relative scrollbar-none">
                        
                        {/* Interactive UI Screens based on mobStep */}
                        <div className="flex-1 flex flex-col justify-between">
                          
                          {/* Inner Screen Header */}
                          <div className="border-b border-slate-800/60 pb-2.5 mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Brain className="w-4 h-4 text-indigo-400 animate-pulse" />
                              <span className="text-xs font-bold font-display tracking-tight text-slate-200">CBT Sanctuary</span>
                            </div>
                            <span className="text-[9px] font-mono bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-400">
                              {mobStep === 0 ? 'INPUT' : `STEP ${mobStep}/4`}
                            </span>
                          </div>

                          {/* SCREEN RENDERERS */}
                          {isProcessing ? (
                            /* AI Processing Overlay */
                            <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-8">
                              <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/10 border-t-indigo-400 animate-spin" />
                                <Sparkles className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                              </div>
                              <div className="text-center space-y-1">
                                <p className="text-xs font-mono text-indigo-400 font-bold animate-pulse">
                                  {isKorean ? 'xlm-roberta 추론 중...' : 'Running NLP Inference...'}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                  {isKorean ? '인지 왜곡 특징맵 생성 중' : 'Parsing cognitive errors...'}
                                </p>
                              </div>
                            </div>
                          ) : mobStep === 0 ? (
                            
                            /* STEP 0: Negative Thought Input or Selection */
                            <div className="space-y-4 flex-1 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="text-center py-1">
                                  <h3 className="text-sm font-bold text-white">생각의 오염도 측정</h3>
                                  <p className="text-[10.5px] text-slate-400 mt-0.5 leading-relaxed">
                                    머릿속을 괴롭히는 부정적인 생각 원형을 선택하거나 직접 기록해 주세요.
                                  </p>
                                </div>

                                {/* Custom Input form */}
                                <form onSubmit={handleCustomSubmit} className="space-y-2">
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={customThought}
                                      onChange={(e) => setCustomThought(e.target.value)}
                                      placeholder={isKorean ? "부정적인 생각을 직접 적어보세요..." : "Type your negative thought..."}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 pr-10"
                                    />
                                    <button
                                      type="submit"
                                      disabled={!customThought.trim()}
                                      className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
                                    >
                                      <Sparkles className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </form>

                                {/* Presets Divider */}
                                <div className="flex items-center gap-2 py-1">
                                  <div className="h-[1px] bg-slate-800/80 flex-1" />
                                  <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">PRESETS</span>
                                  <div className="h-[1px] bg-slate-800/80 flex-1" />
                                </div>

                                {/* Thought presets selector matching the video */}
                                <div className="space-y-2 max-h-[170px] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-800">
                                  {THOUGHT_TEMPLATES.map((t) => (
                                    <button
                                      key={t.id}
                                      onClick={() => {
                                        setSelectedThought(t.id);
                                        setCustomThought('');
                                        // Trigger inference automatically
                                        setIsProcessing(true);
                                        setTimeout(() => {
                                          setSimulatedResult(t);
                                          setIsProcessing(false);
                                          setMobStep(1);
                                          setSelectedSocraticCheckboxes([1, 2]);
                                        }, 800);
                                      }}
                                      className={`w-full text-left p-2.5 rounded-xl border text-[11px] leading-relaxed transition-all ${
                                        selectedThought === t.id && !customThought
                                          ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 shadow shadow-indigo-950/50'
                                          : 'bg-slate-950/40 border-slate-800/50 text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                                      }`}
                                    >
                                      <span className="font-medium block">{isKorean ? t.textKo : t.textEn}</span>
                                      {t.id === 't4' && (
                                        <span className="inline-block mt-1 text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 rounded-full font-mono font-semibold">
                                          🎬 Video Example (답장 대기)
                                        </span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="text-[9.5px] text-slate-500 text-center italic mt-2">
                                * 온디바이스 분류엔진이 활성화되어 있습니다.
                              </div>
                            </div>

                          ) : mobStep === 1 ? (
                            
                            /* STEP 1: AI Scan Report */
                            <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="text-center py-0.5">
                                  <h3 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-wider">오류 왜곡 스캔 리포트</h3>
                                  <span className="text-[10px] text-slate-400">오염된 생각을 정량 분석했습니다.</span>
                                </div>

                                {/* Raw Thought Box */}
                                <div className="bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-xl text-[11px] text-amber-200 leading-relaxed italic text-center">
                                  "{simulatedResult ? (isKorean ? simulatedResult.textKo : simulatedResult.textEn) : ''}"
                                </div>

                                {/* Analysis Distortion bars */}
                                <div className="space-y-2.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                                  <span className="text-[9px] font-mono text-indigo-300 font-bold block uppercase tracking-wide">AI 인지 왜곡 탐지율</span>
                                  {simulatedResult?.distortions.map((d, i) => (
                                    <div key={i} className="space-y-0.5">
                                      <div className="flex justify-between text-[10px] text-slate-300">
                                        <span className="truncate max-w-[150px] font-medium">{isKorean ? d.name.split(' (')[1]?.replace(')', '') || d.name : d.name}</span>
                                        <span className="font-mono text-indigo-400 font-bold">{d.percentage}%</span>
                                      </div>
                                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${d.percentage}%` }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Explanatory Note */}
                                <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-800/40 text-[10.5px] text-slate-400 leading-relaxed">
                                  <span className="font-semibold text-slate-200">주요 왜곡 요인:</span>{' '}
                                  {simulatedResult?.id === 't4' 
                                    ? '독심술 오류(Mind Reading)가 매우 높게 관측됩니다. 상대방의 직접적인 언질이나 증거가 없음에도, 임의로 자신을 싫어하거나 무시한다고 확신하는 전형적인 오작동 상태입니다.'
                                    : '과도하게 최악의 극단적 손해 상태만을 상상하는 파국화 필터가 작동 중입니다. 이 불안 고리를 끊기 위한 인지 왜곡 리프레이밍이 추천됩니다.'}
                                </div>
                              </div>

                              <button
                                onClick={() => setMobStep(2)}
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-[11px] transition-all flex items-center justify-center gap-1.5"
                              >
                                <span>해결을 위한 경로 개척</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          ) : mobStep === 2 ? (
                            
                            /* STEP 2: Choose Path (Unifies all 3 pillars!) */
                            <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="text-center py-0.5">
                                  <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">치유 행동 노선 선택</h3>
                                  <p className="text-[10px] text-slate-400">오염된 마음을 어떤 노선으로 해결할까요?</p>
                                </div>

                                <div className="space-y-2">
                                  {[
                                    { id: 'cognitive', title: '인지적 치료 (생각의 뒤집기)', desc: '질문을 통해 모순을 파헤치고 대안을 재정립합니다.', color: 'border-indigo-500/30 hover:border-indigo-500 text-indigo-400' },
                                    { id: 'behavioral', title: '행동 활성화 (산책하기) [추천]', desc: '실외로 나가 온천천 강변을 걸으며 마음을 정화합니다.', color: 'border-cyan-500/30 hover:border-cyan-500 text-cyan-400' },
                                    { id: 'acceptance', title: '자아 성찰 (내면의 수용)', desc: '나의 따뜻한 눈빛 사진을 스캔해 긍정을 충전합니다.', color: 'border-pink-500/30 hover:border-pink-500 text-pink-400' },
                                  ].map((opt) => (
                                    <button
                                      key={opt.id}
                                      onClick={() => setSelectedActionItem(opt.id)}
                                      className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                                        selectedActionItem === opt.id 
                                          ? 'bg-slate-900 border-indigo-500 shadow-inner' 
                                          : 'bg-slate-950/40 border-slate-800'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedActionItem === opt.id ? 'border-indigo-400' : 'border-slate-700'}`}>
                                          {selectedActionItem === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-200">{opt.title}</span>
                                      </div>
                                      <p className="text-[9.5px] text-slate-400 pl-5 mt-0.5 leading-relaxed">{opt.desc}</p>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  if (selectedActionItem === 'behavioral') {
                                    setActiveCbtPath('behavioral');
                                    setMobStep(0);
                                  } else if (selectedActionItem === 'acceptance') {
                                    setActiveCbtPath('acceptance');
                                    setMobStep(0);
                                  } else {
                                    setMobStep(3);
                                  }
                                }}
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-[11px] transition-all flex items-center justify-center gap-1.5"
                              >
                                <span>치료 탐색 개시</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          ) : mobStep === 3 ? (
                            
                            /* STEP 3: Socratic Questioning Checklist */
                            <div className="space-y-3 flex-1 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="text-center">
                                  <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">소크라테스 질문식 진실 규명</h3>
                                  <p className="text-[10px] text-slate-400">생각 뒤의 논리적 모순을 짚어냅니다.</p>
                                </div>

                                {/* Socratic Question Prominent */}
                                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 text-[10.5px] text-slate-300 leading-relaxed font-sans font-medium">
                                  <HelpCircle className="w-3.5 h-3.5 text-purple-400 inline mr-1.5 align-text-bottom" />
                                  <span>{socraticDataForThought.questionKo}</span>
                                </div>

                                {/* Customized interactive choices representing the video */}
                                <div className="space-y-2">
                                  {socraticDataForThought.choicesKo.map((choice, idx) => {
                                    const isChecked = selectedSocraticCheckboxes.includes(idx);
                                    return (
                                      <button
                                        key={idx}
                                        onClick={() => {
                                          if (isChecked) {
                                            setSelectedSocraticCheckboxes(selectedSocraticCheckboxes.filter(i => i !== idx));
                                          } else {
                                            setSelectedSocraticCheckboxes([...selectedSocraticCheckboxes, idx]);
                                          }
                                        }}
                                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                                          isChecked 
                                            ? 'bg-purple-950/20 border-purple-500/40 text-slate-200' 
                                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-900/20'
                                        }`}
                                      >
                                        <div className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-700'}`}>
                                          {isChecked && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <span className="text-[10.5px] leading-relaxed">{choice}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <button
                                onClick={() => setMobStep(4)}
                                disabled={selectedSocraticCheckboxes.length === 0}
                                className="w-full py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold rounded-xl text-[11px] transition-all flex items-center justify-center gap-1.5"
                              >
                                <span>대안 수용하기</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          ) : (
                            
                            /* STEP 4: Mature Thoughts / Reframe Result */
                            <div className="space-y-3 flex-1 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="text-center">
                                  <h3 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">새롭고 유연해진 시야</h3>
                                  <p className="text-[10px] text-slate-400">당신을 안아줄 지혜가 완성되었습니다.</p>
                                </div>

                                {/* Reframe Trophy card */}
                                <div className="p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-xl space-y-2 text-left">
                                  <span className="text-[9px] font-mono text-emerald-400 font-bold block uppercase tracking-wider">🌟 대안적 수용 생각</span>
                                  <p className="text-[10.5px] text-slate-100 font-sans leading-relaxed font-semibold">
                                    "{socraticDataForThought.matureThoughtsKo[0]}"
                                  </p>
                                  {socraticDataForThought.matureThoughtsKo[1] && (
                                    <p className="text-[10px] text-slate-300 font-sans leading-relaxed mt-1">
                                      • {socraticDataForThought.matureThoughtsKo[1]}
                                    </p>
                                  )}
                                </div>

                                {/* Fact Check Summary block */}
                                <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-800/60 space-y-1.5">
                                  <span className="text-[9px] font-mono text-indigo-300 font-bold block uppercase tracking-wider">💡 증명된 현실적 증거</span>
                                  <div className="space-y-1">
                                    {selectedSocraticCheckboxes.map((idx) => (
                                      <div key={idx} className="flex items-center gap-1.5 text-[9.5px] text-slate-400">
                                        <div className="w-1 h-1 rounded-full bg-indigo-400" />
                                        <span className="truncate max-w-[260px]">{socraticDataForThought.choicesKo[idx]}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <button
                                  onClick={() => {
                                    // Save to cabinet
                                    const currentText = simulatedResult ? (isKorean ? simulatedResult.textKo : simulatedResult.textEn) : '';
                                    const chosenLogicList = socraticDataForThought.choicesKo.filter((_, idx) => selectedSocraticCheckboxes.includes(idx));
                                    const newWisdom = {
                                      id: 'w_' + Date.now(),
                                      original: currentText,
                                      distortions: simulatedResult?.distortions.map(d => isKorean ? d.name.split(' (')[1]?.replace(')', '') || d.name : d.name) || [],
                                      logicLink: chosenLogicList.length > 0 ? chosenLogicList.join(' / ') : '자기 성찰을 통한 인지 모순 반박 완료',
                                      matureThoughts: socraticDataForThought.matureThoughtsKo
                                    };
                                    setSavedWisdoms([newWisdom, ...savedWisdoms]);
                                    setMobStep(0);
                                    setSelectedThought('t4');
                                    setCustomThought('');
                                    
                                    // Visual toast trigger
                                    setShowSaveToast(true);
                                    setTimeout(() => setShowSaveToast(false), 2400);
                                  }}
                                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-[11px] transition-all flex items-center justify-center gap-1"
                                >
                                  <span>지혜의 보관함에 새겨넣기 ★</span>
                                </button>

                                <button
                                  onClick={() => setMobStep(3)}
                                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded-xl text-[10px] transition-all"
                                >
                                  이전 단계로
                                </button>
                              </div>
                            </div>
                          )}

                        </div>

                        {/* Interactive Home indicator inside mobile */}
                        <div className="mt-3 flex justify-center">
                          <button 
                            onClick={() => {
                              setMobStep(0);
                              setCustomThought('');
                            }}
                            className="w-20 h-1 bg-slate-700 rounded-full hover:bg-slate-500 transition-colors"
                            title="Reset Phone to Screen 0"
                          />
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Right Column: Saved Wisdom Cabinet (지혜의 보관함) */}
                  <div className="lg:col-span-6 flex flex-col justify-between space-y-6 h-full min-h-[500px]">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-display">
                            <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
                            <span>지혜의 보관함 (Wisdom Cabinet)</span>
                          </h3>
                          <p className="text-xs text-slate-500 font-sans mt-0.5">
                            CBT 성역을 통해 정화되어 누적된 이정표 카드들입니다.
                          </p>
                        </div>
                        <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                          {savedWisdoms.length}개 보관됨
                        </span>
                      </div>

                      {/* Toast notification overlay when saved */}
                      <AnimatePresence>
                        {showSaveToast && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs rounded-xl flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <div>
                              <span className="font-bold">지혜의 비약 저장 완료!</span>
                              <span className="block text-[10px] text-slate-400">인지 재구성 결과가 우측 지혜의 보관함에 무사히 봉인되었습니다.</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Scrolling Cabinet List */}
                      <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                        {savedWisdoms.length === 0 ? (
                          <div className="p-8 text-center bg-slate-900/20 rounded-2xl border border-dashed border-slate-800 text-slate-500 italic text-xs">
                            보관함이 비어 있습니다. 왼쪽 스마트폰 시뮬레이터에서 인지 왜곡 해결 과정을 진행해 보세요!
                          </div>
                        ) : (
                          savedWisdoms.map((w, index) => (
                            <div 
                              key={w.id} 
                              className="bg-gradient-to-r from-slate-900/60 to-slate-950/60 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-3 relative overflow-hidden group"
                            >
                              {/* Background subtle watermark */}
                              <div className="absolute right-2 bottom-0 text-[56px] font-bold font-mono text-slate-900/10 pointer-events-none select-none">
                                #{savedWisdoms.length - index}
                              </div>

                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1 flex-1">
                                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">오염원 전치</span>
                                  <p className="text-xs text-slate-400 line-through italic leading-relaxed">
                                    "{w.original}"
                                  </p>
                                </div>

                                <button
                                  onClick={() => {
                                    setSavedWisdoms(savedWisdoms.filter(item => item.id !== w.id));
                                  }}
                                  className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-500/20 transition-all"
                                  title="Delete Wisdom Card"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Distortion badges */}
                              <div className="flex flex-wrap gap-1">
                                {w.distortions.map((dist, i) => (
                                  <span 
                                    key={i}
                                    className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium"
                                  >
                                    ⚠️ {dist}
                                  </span>
                                ))}
                              </div>

                              <div className="border-t border-slate-900 pt-2.5 space-y-2">
                                <div className="space-y-1">
                                  <span className="text-[9px] font-mono text-indigo-400 font-bold block uppercase tracking-wide">💡 정립된 논리 고리</span>
                                  <p className="text-[10.5px] text-slate-300 leading-relaxed pl-2 border-l-2 border-indigo-500/30">
                                    {w.logicLink}
                                  </p>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[9px] font-mono text-emerald-400 font-bold block uppercase tracking-wide">🌟 수립된 대안 수용 지혜</span>
                                  <div className="space-y-1 pl-2 border-l-2 border-emerald-500/30">
                                    {w.matureThoughts.map((mt, i) => (
                                      <p key={i} className="text-[11px] text-slate-100 font-sans font-medium leading-relaxed">
                                        "{mt}"
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Bottom Project Specs banner */}
                    <div className="bg-indigo-950/20 border border-indigo-500/10 p-3.5 rounded-xl space-y-1.5 text-left">
                      <span className="text-[10px] font-mono text-indigo-400 font-bold block uppercase tracking-wider">
                        🛠️ Socratic Questioning & Cognitive Restructuring Path
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        본 앱은 오염된 불안 원본을 <span className="text-slate-200 font-semibold">독심술, 파국화, 흑백논리</span> 등 인지왜곡 분류 가중치를 통해 계량 분석한 후, 4단계 질문지 양식을 통해 논리적인 수용 필터를 적용해 유연한 대체 사고를 재건합니다.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* Path 2: Location & Weather-Aware Behavioral Activation */}
              {activeCbtPath === 'behavioral' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                  {/* Left: Location Selector */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs uppercase tracking-wider font-mono text-slate-500 font-semibold block">
                        {isKorean ? '산책 코스 선택 (GPS 이동 목적지)' : 'Choose Active Walk Course'}
                      </label>

                      <div className="space-y-3">
                        {[
                          { id: 'oncheoncheon', labelEn: 'Oncheoncheon Stream (온천천)', subEn: 'Right beside PNU Campus • 2.5 km', subKo: '부산대 옆 아늑한 하천 산책로 • 2.5 km' },
                          { id: 'beach', labelEn: 'Busan Beach (Haeundae)', subEn: 'Ocean breeze perspective shift • 4.5 km', subKo: '드넓은 바다 수평선 관점 시프트 • 4.5 km' },
                          { id: 'mountain', labelEn: 'Geumjeongsan Mountain (금정산)', subEn: 'Pine forest phytoncide trail • 5.0 km', subKo: '부산대 미술관 뒤 소나무 숲길 • 5.0 km' },
                        ].map((loc) => (
                          <button
                            key={loc.id}
                            onClick={() => {
                              setSelectedLocation(loc.id as any);
                              resetGpsTracking();
                            }}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                              selectedLocation === loc.id
                                ? 'bg-cyan-950/45 border-cyan-500/60 text-white shadow-md shadow-cyan-950/20'
                                : 'bg-slate-900/20 border-slate-800/40 text-slate-400 hover:bg-slate-900/30 hover:text-slate-300'
                            }`}
                          >
                            <div className="text-sm font-semibold">{loc.labelEn}</div>
                            <div className="text-xs text-slate-500 mt-1 font-sans">{isKorean ? loc.subKo : loc.subEn}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: GPS Google Maps Integration, Timer, and Km Walked */}
                  <div className="lg:col-span-7 bg-slate-950/60 rounded-xl border border-slate-800/80 p-5 md:p-6 space-y-6 flex flex-col justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono px-2 py-0.5 rounded uppercase">
                            CBT BEHAVIORAL ACTIVATION MODULE
                          </span>
                          <h3 className="text-lg font-bold text-white mt-1.5 font-display">
                            {isKorean ? activeCourse.titleKo : activeCourse.titleEn}
                          </h3>
                        </div>
                        <div className="text-right shrink-0 font-mono text-xs">
                          <span className="text-cyan-400 block font-semibold">{activeCourse.targetDistance} km</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">{isKorean ? '목표 거리' : 'TARGET DIST'}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-slate-800/40">
                        {isKorean ? activeCourse.descKo : activeCourse.descEn}
                      </p>

                      {/* Google Maps Simulation Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        
                        {/* Interactive Vector Map Simulator */}
                        <div className="md:col-span-8 bg-slate-950 border border-slate-900 rounded-xl p-3 relative flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
                          {/* Map Grid Watermark lines */}
                          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-[0.05]">
                            {[...Array(36)].map((_, i) => (
                              <div key={i} className="border-t border-l border-slate-500" />
                            ))}
                          </div>

                          {/* Map Background Textures based on Location */}
                          {selectedLocation === 'oncheoncheon' && (
                            <div className="absolute inset-0 bg-blue-950/5 flex items-center justify-center -z-10" />
                          )}
                          {selectedLocation === 'beach' && (
                            <div className="absolute inset-0 bg-cyan-950/5 flex items-center justify-center -z-10" />
                          )}
                          {selectedLocation === 'mountain' && (
                            <div className="absolute inset-0 bg-emerald-950/5 flex items-center justify-center -z-10" />
                          )}

                          {/* SVG Path Rendering */}
                          <svg className="w-full h-[180px] text-slate-700 z-10" viewBox="0 0 400 200">
                            {/* Base Streets Mockups */}
                            <path d="M 10 30 Q 80 50 150 20 T 300 40" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="3 3" />
                            <path d="M 50 190 L 120 80 L 250 110 L 380 40" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="3 3" />

                            {/* Stream Watercourse for Oncheoncheon */}
                            {selectedLocation === 'oncheoncheon' && (
                              <path d="M 0,110 Q 100,160 200,90 T 400,120" fill="none" stroke="#1d4ed8" strokeWidth="12" className="opacity-15" />
                            )}
                            {/* Sea shore for beach */}
                            {selectedLocation === 'beach' && (
                              <rect x="0" y="120" width="400" height="80" fill="#0891b2" className="opacity-10" />
                            )}
                            {/* Forests for mountain */}
                            {selectedLocation === 'mountain' && (
                              <circle cx="300" cy="100" r="60" fill="#059669" className="opacity-5" />
                            )}

                            {/* Ground Route Path (Dashed/Active) */}
                            <path
                              ref={pathRef}
                              d={activeCourse.path}
                              fill="none"
                              stroke="#334155"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />

                            {/* Completed route tracking projection */}
                            <path
                              d={activeCourse.path}
                              fill="none"
                              stroke="#06b6d4"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray="400"
                              strokeDashoffset={400 - (400 * percentage) / 100}
                              className="transition-all duration-300"
                            />

                            {/* Start Node */}
                            <circle cx={selectedLocation === 'oncheoncheon' ? 30 : selectedLocation === 'beach' ? 20 : 40} cy={selectedLocation === 'oncheoncheon' ? 170 : selectedLocation === 'beach' ? 150 : 180} r="6" fill="#10b981" />
                            <text x={selectedLocation === 'oncheoncheon' ? 30 : selectedLocation === 'beach' ? 20 : 40} y={selectedLocation === 'oncheoncheon' ? 190 : selectedLocation === 'beach' ? 170 : 198} fill="#10b981" className="text-[10px] font-mono font-bold" textAnchor="middle">START</text>

                            {/* End Node */}
                            <circle cx={selectedLocation === 'oncheoncheon' ? 350 : selectedLocation === 'beach' ? 380 : 360} cy={selectedLocation === 'oncheoncheon' ? 90 : selectedLocation === 'beach' ? 80 : 50} r="6" fill="#ef4444" />
                            <text x={selectedLocation === 'oncheoncheon' ? 350 : selectedLocation === 'beach' ? 380 : 360} y={selectedLocation === 'oncheoncheon' ? 76 : selectedLocation === 'beach' ? 66 : 36} fill="#ef4444" className="text-[10px] font-mono font-bold" textAnchor="middle">GOAL</text>

                            {/* Active pulsating GPS Tracker node */}
                            <g transform={`translate(${pointerPos.x}, ${pointerPos.y})`}>
                              <circle r="12" fill="#06b6d4" className="opacity-20 animate-ping" />
                              <circle r="6" fill="#22d3ee" stroke="#0891b2" strokeWidth="2" />
                            </g>
                          </svg>

                          {/* Map status indicator in margin */}
                          <div className="absolute bottom-2.5 left-3.5 flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded border border-slate-800/50 z-20">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                            <span className="text-[9px] font-mono text-cyan-400">
                              {isTrackingGps 
                                ? `SIMULATED LIVE COORDINATES: ${(activeCourse.coords.lat + (percentage / 10000)).toFixed(5)}°N, ${(activeCourse.coords.lng + (percentage / 10000)).toFixed(5)}°E` 
                                : `STATIONARY: ${activeCourse.coords.lat.toFixed(4)}°N, ${activeCourse.coords.lng.toFixed(4)}°E`}
                            </span>
                          </div>
                        </div>

                        {/* Stats Dashboard: Timer and Km Walked */}
                        <div className="md:col-span-4 flex flex-col justify-between gap-3 bg-slate-900/40 border border-slate-900 rounded-xl p-4">
                          
                          {/* Timer Block */}
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">{isKorean ? '경과 시간' : 'TIMER'}</span>
                            <div className="font-mono text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                              <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800/80">
                                {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}
                              </span>
                              <span className="text-slate-600 animate-pulse">:</span>
                              <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800/80">
                                {String(timerSeconds % 60).padStart(2, '0')}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-slate-600 block">MINUTES : SECONDS</span>
                          </div>

                          {/* Km Walked Block */}
                          <div className="space-y-1 pt-2 border-t border-slate-900">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block">{isKorean ? '걸은 거리' : 'DISTANCE'}</span>
                            <div className="text-3xl font-bold text-cyan-400 font-mono tracking-tight">
                              {distanceKm.toFixed(2)} <span className="text-xs text-slate-400">km</span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5">
                              <div className="bg-cyan-500 h-full transition-all duration-300" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-[9px] font-mono text-slate-500 block text-right">{percentage.toFixed(0)}% COMPLETED</span>
                          </div>

                          {/* Control Action Button */}
                          <div className="pt-3 border-t border-slate-900 space-y-2">
                            <button
                              onClick={startGpsTracking}
                              disabled={isTrackingGps || percentage >= 100}
                              className={`w-full py-2 rounded-lg text-xs font-semibold font-mono transition-all flex items-center justify-center gap-1.5 ${
                                isTrackingGps
                                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 cursor-not-allowed'
                                  : percentage >= 100
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                              }`}
                            >
                              <span>
                                {isTrackingGps 
                                  ? (isKorean ? '산책로 추적 중...' : 'GPS TRACKING ACTIVE') 
                                  : percentage >= 100
                                    ? (isKorean ? '완료 ✓' : 'WALK COMPLETED ✓')
                                    : (isKorean ? '모의 산책 개시' : 'START SIMULATED WALK')}
                              </span>
                            </button>

                            {(isTrackingGps || percentage > 0) && (
                              <button
                                onClick={resetGpsTracking}
                                className="w-full py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px] font-mono transition-all flex items-center justify-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>{isKorean ? '초기화' : 'RESET ROUTE'}</span>
                              </button>
                            )}
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* Path 3: Self-Acceptance & Appreciation (Positive Image Analyzer) */}
              {activeCbtPath === 'acceptance' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Preset selector and uploader */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs uppercase tracking-wider font-mono text-slate-500 font-semibold block">
                        {isKorean ? '단계 1: 자존감 향상을 위한 사진 업로드 / 선택' : 'Step 1: Choose or Upload a Photo to Appraise'}
                      </label>

                      {/* Presets and Upload Selector buttons */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-2">
                          <button
                            onClick={() => {
                              setSelectedImagePreset('sketch');
                              setShowImageResult(false);
                            }}
                            className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between gap-1.5 ${
                              selectedImagePreset === 'sketch'
                                ? 'bg-pink-950/20 border-pink-500/60 text-white'
                                : 'bg-slate-900/20 border-slate-800/60 text-slate-400 hover:bg-slate-900/30'
                            }`}
                          >
                            <span className="font-semibold block">{isKorean ? '연필 정밀 스케치화' : 'Warm Charcoal Sketch'}</span>
                            <span className="text-[9px] font-mono text-slate-500">Preset A (Neutral Sketch)</span>
                          </button>
                        </div>

                        {/* File Upload Zone */}
                        <div className="relative">
                          <label className="flex flex-col items-center justify-center border border-dashed border-slate-800 hover:border-pink-500/40 rounded-xl p-4 cursor-pointer bg-slate-900/10 hover:bg-slate-900/30 transition-all text-center space-y-1">
                            <Upload className="w-5 h-5 text-slate-500" />
                            <span className="text-xs text-slate-300 font-medium">
                              {isKorean ? '컴퓨터에서 사진 올리기' : 'Upload Your Personal Photo'}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              JPG, PNG (FileReader simulation supported)
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Polaroid Photo Frame Preview */}
                    <div className="bg-slate-900/20 p-4 rounded-xl border border-slate-800/60 space-y-3.5 text-center">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                        {isKorean ? '실시간 인지치료 사진 프레임 예시' : 'Therapeutic Frame Preview'}
                      </span>

                      <div className="relative mx-auto w-56 bg-white p-3 pb-8 shadow-xl border border-slate-200 rounded-sm transform rotate-1 hover:rotate-0 transition-transform duration-300">
                        <div className="relative overflow-hidden aspect-square bg-slate-50 border border-slate-100 flex items-center justify-center">
                          {selectedImagePreset === 'sketch' ? (
                            <img
                              src={selfSketchImg}
                              alt="Charcoal Sketch Preset"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : uploadedImageSrc ? (
                            <img
                              src={uploadedImageSrc}
                              alt="Custom uploaded user"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="text-slate-300 text-xs flex flex-col items-center gap-1">
                              <ImageIcon className="w-8 h-8 opacity-40" />
                              <span>{isKorean ? '사진을 추가하세요' : 'No custom photo'}</span>
                            </div>
                          )}

                          {/* Laserscan Line sweep overlay */}
                          {isScanningImage && (
                            <motion.div
                              initial={{ top: '0%' }}
                              animate={{ top: '100%' }}
                              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                              className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_12px_rgba(236,72,153,0.8)] z-10"
                            />
                          )}
                        </div>
                        {/* Polaroid handwritten caption */}
                        <div className="mt-3.5 font-mono text-[11px] text-slate-800 font-medium">
                          {isKorean ? '나의 소중한 모습 2026' : 'My Precious Presence 2026'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Positive Appearance Appraiser Output */}
                  <div className="lg:col-span-7 bg-slate-950/60 rounded-xl border border-slate-800/80 p-5 md:p-6 flex flex-col justify-between min-h-[400px]">
                    {isScanningImage ? (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin" />
                        <div className="text-center">
                          <p className="text-sm font-mono text-pink-400 font-medium animate-pulse">
                            {isKorean ? '제미나이 미학 보조 인식 모델 기동 중...' : 'Launching Gemini Self-Acceptance Engine...'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {isKorean ? '미세 디테일 긍정 피드백 패턴 조율 중' : 'Synthesizing positive aura details...'}
                          </p>
                        </div>
                      </div>
                    ) : showImageResult && appearanceFeedback ? (
                      <div className="space-y-5 flex-1">
                        <div>
                          <span className="text-[10px] bg-pink-500/10 border border-pink-500/20 text-pink-400 font-mono px-2 py-0.5 rounded uppercase">
                            GEMINI APPRECIATION ANALYSIS
                          </span>
                          <h3 className="text-lg font-bold text-white mt-1.5 font-display flex items-center gap-1.5">
                            <Smile className="w-5 h-5 text-pink-400" />
                            <span>{isKorean ? '제미나이가 바라본 당신의 가장 매력적인 점' : 'Your Positive Aesthetic & Radiance Points'}</span>
                          </h3>
                        </div>

                        <div className="space-y-3">
                          {appearanceFeedback[isKorean ? 'ko' : 'en'].map((pt, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.15 }}
                              className="p-3 bg-slate-900/30 rounded-lg border border-slate-800/40 text-xs text-slate-200 leading-relaxed flex items-start gap-3"
                            >
                              <div className="font-mono text-pink-400 font-bold shrink-0 mt-0.5">#{idx + 1}</div>
                              <div>{pt}</div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Acceptance quote */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-pink-950/15 to-purple-950/10 border border-pink-500/10 text-xs text-slate-300 leading-relaxed italic text-center">
                          {isKorean 
                            ? '“무엇이 우리를 불안하게 만드는 것은 상황 자체가 아니라, 우리가 스스로를 바라보는 시선입니다.” 인지왜곡을 벗어나 있는 그대로의 온전한 당신의 가치를 수용하세요.'
                            : '"Beauty begins the moment you decide to accept and celebrate your own unique, intelligent existence." Reframe your self-criticism into absolute positive self-compassion.'}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-6">
                        <Camera className="w-12 h-12 text-slate-600 opacity-60 animate-bounce" />
                        <div className="max-w-sm space-y-1">
                          <h4 className="text-sm font-semibold text-slate-300">
                            {isKorean ? '제미나이 긍정 사진 피드백 준비 완료' : 'Awaiting Image Appraisals'}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {isKorean 
                              ? '외모 자신감이 떨어질 때, 사진을 고르고 아래 버튼을 눌러보세요. 제미나이가 당신이 미처 보지 못한 특별한 장점을 가득 짚어 드립니다.'
                              : 'Select a portrait option or upload your own, then click below to trigger warm, personalized clinical aesthetic highlights.'}
                          </p>
                        </div>
                        <button
                          onClick={runImageAnalysis}
                          className="mt-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-lg shadow-pink-600/20 transition-all flex items-center gap-1.5"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{isKorean ? '제미나이 긍정 피드백 분석 실행' : 'Analyze Appearance Positives'}</span>
                        </button>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span>Vision: Gemini Flash Image Engine</span>
                      {showImageResult && (
                        <button onClick={runImageAnalysis} className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                          <RotateCcw className="w-3 h-3" />
                          <span>{isKorean ? '다시 분석하기' : 'Analyze Again'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8 text-slate-300 font-sans"
          >
            {/* Project Overview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white font-display border-b border-slate-800 pb-2">
                {isKorean ? '프로젝트 아키텍처 개요' : 'Project Architecture & Strategy'}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {isKorean
                  ? '이 시스템은 기존의 무거운 LLM 기반 정신건강 상담 솔루션들이 갖는 응답성 저하 및 트래픽 요금 부담 문제를 해결하기 위해 고안되었습니다. 인지 왜곡 분류 처리는 모바일에 초경량으로 최적화된 XLM-Roberta 추론 엔진을 통해 네트워크 연결이 없는 오프라인 상태에서도 0ms에 가깝게 동작하며, 세밀하고 깊이 있는 리프레이밍 질문과 행동 교정 처리는 클라우드의 가벼운 제미나이 생성형 AI 모델과 통신하도록 결합 설계하여 모바일 앱 구동 안정성과 응답 속도를 극대화했습니다.'
                  : 'This application addresses the high latency and cost associated with server-dependent mental health applications by utilizing a hybrid localized approach. It deploys an on-device XLM-Roberta model for millisecond-latency classification of cognitive distortions, complemented by the Gemini API for generative, context-rich Socratic reframing, and location tracking APIs to recommend real-world corrective activation.'}
              </p>
            </div>

            {/* Technical grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pillar Table */}
              <div className="space-y-3 bg-slate-900/30 p-5 rounded-xl border border-slate-800/40">
                <h4 className="text-sm font-semibold font-display text-white">{isKorean ? '3대 치료 필러 및 구현체' : 'The 3 Clinical Pillars'}</h4>
                <div className="divide-y divide-slate-800 text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="font-semibold text-indigo-400">{isKorean ? '1. 인지 치료 (Cognitive)' : '1. Cognitive'}</span>
                    <span className="text-slate-400">{isKorean ? '소크라테스식 질문 대화 엔진 (Gemini)' : 'Socratic dialogue engine (Gemini API)'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="font-semibold text-cyan-400">{isKorean ? '2. 행동 활성화 (Behavioral)' : '2. Behavioral'}</span>
                    <span className="text-slate-400">{isKorean ? 'GPS 기반 위치 탐색 + 기상 조건 매칭' : 'GPS + Weather-aware course algorithms'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="font-semibold text-pink-400">{isKorean ? '3. 자기 수용 (Acceptance)' : '3. Self-acceptance'}</span>
                    <span className="text-slate-400">{isKorean ? '사진 업로드 + 제미나이 미학 보증 환류 루프' : 'Image Upload & Gemini Self-Acceptance Appraisal'}</span>
                  </div>
                </div>
              </div>

              {/* Machine learning specifications */}
              <div className="space-y-3 bg-slate-900/30 p-5 rounded-xl border border-slate-800/40">
                <h4 className="text-sm font-semibold font-display text-white">{isKorean ? '머신러닝 학습 모델 명세' : 'Machine Learning Technical Spec'}</h4>
                <div className="divide-y divide-slate-800 text-xs font-mono">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Base Model:</span>
                    <span className="text-slate-300">xlm-roberta-base (PyTorch → ONNX)</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Task:</span>
                    <span className="text-slate-300">5-label multi-label classification</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Dataset Size:</span>
                    <span className="text-slate-300">2,530 samples (Kaggle patient utterances)</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Training parameters:</span>
                    <span className="text-slate-300">Epoch 4, Batch 16, LR 2e-5, Max Seq 128</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Engineering Highlights */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold font-display text-white">
                {isKorean ? '안정성 및 모바일 성능 엔지니어링 하이라이트' : 'Engineering Highlights & Fault Tolerance'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/60 space-y-1.5">
                  <span className="font-semibold text-white block">ANR Prevention</span>
                  <p className="text-slate-400 leading-relaxed">
                    {isKorean
                      ? '딥러닝 로컬 추론 연산, GPS 백그라운드 수집, 대형 파일 입출력을 Dispatchers.IO 코루틴 쓰레드 풀에 완벽 배치하여 UI 정지율 0ms를 기록했습니다.'
                      : 'Heavy operations (local NLP inference, GPS background fetch, disk I/O) are isolated to Kotlin Coroutines on Dispatchers.IO to guarantee 0ms UI lag.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/60 space-y-1.5">
                  <span className="font-semibold text-white block">Offline Fallback</span>
                  <p className="text-slate-400 leading-relaxed">
                    {isKorean
                      ? 'Gemini 네트워크 지연이나 OpenWeatherMap 오프라인 발생 즉시 rule-based의 로컬 fallbackAnalysisService로 실시간 전환되어 크래시를 원천 방지합니다.'
                      : 'Failures in external cloud APIs dynamically trigger the local rule-based fallbackAnalysisService to provide continuous service without crashing.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/60 space-y-1.5">
                  <span className="font-semibold text-white block">State Preservation</span>
                  <p className="text-slate-400 leading-relaxed">
                    {isKorean
                      ? 'rememberSaveable을 이용해 가로/세로 화면 회전 시에도 데이터 파괴를 방지하고, 프로세스 강제 종료 시 DataStore를 기반으로 이전 상태를 100% 자동 복구합니다.'
                      : 'Utilizes rememberSaveable for orientation handling and background recovery, using Local DataStore to rebuild local states upon unexpected process deaths.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
