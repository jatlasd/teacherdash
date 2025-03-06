export const templates = {
  struggling_learner: {
    label: 'Struggling Learner',
    description: (
      <>
        <p className="font-semibold">Key Traits:</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          <li>Needs significant support</li>
          <li>Struggles with independent work</li>
          <li>Responds well to 1:1 instruction</li>
        </ul>
      </>
    ),
    values: {
      progress: 'making slow progress',
      motivated: true,
      participates: false,
      workStyle: 'relies heavily on teacher support and intervention to complete work',
      helpseeking: 'will often stop working if the teacher walks away to assist another student',
      personality: 'demonstrates the ability to follow guiding questions and prompts when working one-on-one',
      distractibility: 'disengages during instruction by putting head down and not actively participating',
      redirection: 'prefers to wait for teacher guidance and support rather than starting independently',
      focusBehavior: 'faces challenges in initiating work and maintaining engagement',
      strengths: ['following guided questions', 'working one-on-one', 'using visual aids'],
      assessments: ['taking modified assessments', 'small group administration of tests and quizzes'],
      supports: ['study guides', 'visual aids', 'frequent teacher check-ins', 'modified assignments', 'one-on-one instruction'],
      classPresence: 'requires significant teacher support to maintain engagement',
      pronouns: 'he/him'
    }
  },
  quiet_achiever: {
    label: 'Quiet Achiever',
    description: (
      <>
        <p className="font-semibold">Key Traits:</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          <li>Works independently</li>
          <li>Minimal distractions</li>
          <li>Thorough work completion</li>
        </ul>
      </>
    ),
    values: {
      progress: 'making satisfactory progress',
      motivated: true,
      participates: true,
      workStyle: 'works independently and completes assignments thoroughly',
      helpseeking: 'prefers to work alone and rarely seeks assistance',
      personality: 'quiet but friendly, rarely gets distracted by peers',
      distractibility: 'rarely finds themselves distracted during class instruction',
      redirection: 'typically needs minimal redirection to return to tasks',
      focusBehavior: 'maintains focus and completes work efficiently',
      strengths: ['work ethic', 'classwork completion', 'following procedures', 'using visual aids'],
      assessments: ['taking modified assessments'],
      supports: ['visual aids', 'clear instructions', 'modified assessments'],
      classPresence: 'a pleasure to have in class',
      pronouns: 'he/him'
    }
  },
  social_learner: {
    label: 'Social Learner',
    description: (
      <>
        <p className="font-semibold">Key Traits:</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          <li>Strong peer relationships</li>
          <li>Socially motivated</li>
          <li>Benefits from group work</li>
        </ul>
      </>
    ),
    values: {
      progress: 'making satisfactory progress',
      motivated: true,
      participates: true,
      workStyle: 'works diligently but struggles with some of the concepts taught in class',
      helpseeking: 'will ask for help when confused but may become frustrated',
      personality: 'has a great sense of humor and maintains positive relationships with staff and students alike',
      distractibility: 'at times is easily distracted',
      redirection: 'will return to the task at hand and put forth their best effort',
      focusBehavior: 'maintains focus, asks questions, and puts forth their best effort',
      strengths: ['following directions', 'asking questions without being prompted', 'classwork completion'],
      assessments: ['taking modified assessments', 'small group administration of tests and quizzes'],
      supports: ['study guides', 'visual aids', 'frequent teacher check-ins', 'modified assignments'],
      classPresence: 'a pleasure to have in class',
      pronouns: 'he/him'
    }
  },
  self_advocating: {
    label: 'Self-Advocating Student',
    description: (
      <>
        <p className="font-semibold">Key Traits:</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          <li>Seeks help proactively</li>
          <li>Growing independence</li>
          <li>Responds to structure</li>
        </ul>
      </>
    ),
    values: {
      progress: 'making satisfactory progress',
      motivated: true,
      participates: true,
      workStyle: 'works diligently but needs help identifying specific areas of difficulty',
      helpseeking: 'frequently states needing help but struggles to identify specific needs',
      personality: 'demonstrates growing self-advocacy skills',
      distractibility: 'rarely distracted when focused',
      redirection: 'responds well to structured approaches',
      focusBehavior: 'maintains focus when given clear structure',
      strengths: ['following directions', 'asking questions', 'classwork completion'],
      assessments: ['taking modified assessments'],
      supports: ['study guides', 'visual aids', 'structured approaches', 'modified assessments'],
      classPresence: 'a pleasure to have in class',
      pronouns: 'she/her'
    }
  },
  resilient_learner: {
    label: 'Resilient Learner',
    description: (
      <>
        <p className="font-semibold">Key Traits:</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          <li>Embraces challenges</li>
          <li>Positive attitude</li>
          <li>Strong work ethic</li>
        </ul>
      </>
    ),
    values: {
      progress: 'making satisfactory progress',
      motivated: true,
      participates: true,
      workStyle: 'appears to like the challenge of harder math problems and does not become discouraged when making mistakes',
      helpseeking: 'will ask for help when needed without becoming frustrated',
      personality: 'maintains positive attitude even when facing difficulties',
      distractibility: 'rarely finds themselves distracted during class instruction',
      redirection: 'quickly returns to task when redirected',
      focusBehavior: 'maintains focus and asks questions appropriately',
      strengths: ['following directions', 'asking questions without being prompted', 'classwork completion'],
      assessments: ['taking modified assessments'],
      supports: ['study guides', 'visual aids', 'clear instructions', 'modified assignments'],
      classPresence: 'a pleasure to have in class',
      pronouns: 'she/her'
    }
  },
  distracted_social: {
    label: 'Distracted Social',
    description: (
      <>
        <p className="font-semibold">Key Traits:</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          <li>Highly social</li>
          <li>Needs frequent redirection</li>
          <li>Strong in group settings</li>
        </ul>
      </>
    ),
    values: {
      progress: 'making satisfactory progress',
      motivated: true,
      participates: true,
      workStyle: 'works well with partners but struggles independently',
      helpseeking: 'benefits from having text read aloud',
      personality: 'very social and gets along well with peers',
      distractibility: 'frequently becomes distracted by peers',
      redirection: 'returns to task with prompting',
      focusBehavior: 'needs frequent check-ins to maintain focus',
      strengths: ['group work', 'social skills', 'following directions'],
      assessments: ['taking modified assessments', 'small group administration'],
      supports: ['study guides', 'visual aids', 'frequent check-ins', 'modified assessments'],
      classPresence: 'a pleasure to have in class',
      pronouns: 'he/him'
    }
  },
  independent_worker: {
    label: 'Independent Worker',
    description: (
      <>
        <p className="font-semibold">Key Traits:</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          <li>Self-directed learner</li>
          <li>Strong self-advocacy</li>
          <li>Seeks help appropriately</li>
        </ul>
      </>
    ),
    values: {
      progress: 'making satisfactory progress',
      motivated: true,
      participates: true,
      workStyle: 'seeks support independently when needed',
      helpseeking: 'actively seeks teacher assistance when confused',
      personality: 'demonstrates strong work ethic and self-advocacy',
      distractibility: 'occasionally becomes distracted by social interactions',
      redirection: 'typically needs minimal redirection to return to tasks',
      focusBehavior: 'maintains focus with periodic check-ins',
      strengths: ['self-advocacy', 'independent work', 'following instructions'],
      assessments: ['taking modified assessments'],
      supports: ['study guides', 'visual aids', 'clear instructions', 'modified assignments'],
      classPresence: 'a pleasure to have in class',
      pronouns: 'he/him'
    }
  },
  quiet_listener: {
    label: 'Quiet Listener',
    description: (
      <>
        <p className="font-semibold">Key Traits:</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          <li>Attentive but reserved</li>
          <li>Hesitant to seek help</li>
          <li>Focused when on task</li>
        </ul>
      </>
    ),
    values: {
      progress: 'making satisfactory progress',
      motivated: true,
      participates: false,
      workStyle: 'quick to begin work but may get stuck on questions',
      helpseeking: 'rarely seeks help independently',
      personality: 'quiet but attentive during instruction',
      distractibility: 'rarely distracted when focused',
      redirection: 'responds well to teacher check-ins',
      focusBehavior: 'maintains focus with regular check-ins',
      strengths: ['organization', 'following rules', 'group work'],
      assessments: ['taking modified assessments', 'small group administration'],
      supports: ['study guides', 'visual aids', 'frequent teacher check-ins', 'modified assignments'],
      classPresence: 'a pleasure to have in class',
      pronouns: 'she/her'
    }
  },
  creative_distracted: {
    label: 'Creative Distracted',
    description: (
      <>
        <p className="font-semibold">Key Traits:</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          <li>Artistic tendencies</li>
          <li>Off-task behaviors</li>
          <li>Shows potential when focused</li>
        </ul>
      </>
    ),
    values: {
      progress: 'making satisfactory progress',
      motivated: true,
      participates: false,
      workStyle: 'demonstrates creativity but often draws instead of working',
      helpseeking: 'rarely seeks help independently',
      personality: 'quiet but shows understanding when focused',
      distractibility: 'frequently becomes distracted by drawing',
      redirection: 'responds well to quiet check-ins',
      focusBehavior: 'needs frequent quiet reminders to stay on task',
      strengths: ['creativity', 'understanding when focused'],
      assessments: ['taking modified assessments'],
      supports: ['study guides', 'visual aids', 'quiet check-ins', 'modified assessments'],
      classPresence: 'a pleasure to have in class',
      pronouns: 'he/him'
    }
  },
  hardworking_social: {
    label: 'Hardworking Social',
    description: (
      <>
        <p className="font-semibold">Key Traits:</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          <li>Strong work ethic</li>
          <li>Socially engaged</li>
          <li>Benefits from individual attention</li>
        </ul>
      </>
    ),
    values: {
      progress: 'making satisfactory progress',
      motivated: true,
      participates: true,
      workStyle: 'works diligently but prefers individual teacher conversations',
      helpseeking: 'actively seeks teacher assistance when confused',
      personality: 'very social and gets along well with peers',
      distractibility: 'easily distracted by social interactions',
      redirection: 'responds well to gentle reminders to stay on task',
      focusBehavior: 'maintains focus with individual attention',
      strengths: ['self-advocacy', 'work ethic', 'social skills'],
      assessments: ['taking modified assessments'],
      supports: ['study guides', 'visual aids', 'individual teacher time', 'modified assessments'],
      classPresence: 'a pleasure to have in class',
      pronouns: 'he/him'
    }
  }
} 