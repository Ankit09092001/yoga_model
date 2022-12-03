import React from 'react'
import './Instruction.css'
import tree from './images/Tree.jpg'
import chair from './images/Chair.jpg'
import dog from './images/Dog.jpg'
import cobra from './images/Cobra.jpg'
import warrior from './images/Warrior.jpg'

const poseInstructions = {
    Tree: [
        'Get into position. Tree pose often starts from mountain pose (or Tadasana), with both feet planted firmly on the ground and your weight adequately distributed so that you are balanced.',
        'Bend one leg at the knee. Choose the leg you are going to fold in first. If your left leg is your standing leg, keep your left foot planted on the ground, and slowly bend in your right leg at the right knee so that the sole of your right foot rests against your left inner thigh (known as the half-lotus position in Bikram yoga). Point the knee of your bent leg outward, away from your body.',
        'Lengthen your body. Clasp your hands together in Anjali Mudra (also called the “prayer position”)',
        'Hold and repeat. Hold the pose for as long as necessary, making sure to breathe properly. When you’re ready to switch legs, exhale, and return to mountain pose to start again.'
        ],
    Cobra: [
        'Lie prone on the floor. Stretch your legs back, tops of the feet on the floor. Spread your hands on the floor under your shoulders. Hug the elbows back into your body.',
        'On an inhalation, begin to straighten the arms to lift the chest off the floor, going only to the height at which you can maintain a connection through your pubis to your legs. Press the tailbone toward the pubis and lift the pubis toward the navel. Narrow the hip points. Firm but don’t harden the buttocks.',
        'Firm the shoulder blades against the back, puffing the side ribs forward. Lift through the top of the sternum but avoid pushing the front ribs forward, which only hardens the lower back. Distribute the backbend evenly throughout the entire spine.',    
        'Hold the pose anywhere from 15 to 30 seconds, breathing easily. Release back to the floor with an exhalation.'
    ],
    Dog: [
        'Come onto your hands and knees, with your hands a tiny bit in front of your shoulders and your knees directly below your hips. Spread your palms, rooting down through all four corners of your hands, and turn your toes under.',
        'Exhale and lift your knees from the floor, at first keeping your knees slightly bent and your heels lifted off the floor. Lengthen your tailbone away from the back of your pelvis, lift the sitting bones toward the ceiling, and draw your inner legs from your inner ankles up through your groins.',
        'On an exhalation, push your top thighs back and stretch your heels toward the floor. Straighten your knees without locking them.',
        'Firm your outer arms and press the bases of your index fingers actively into the floor. Lift along your inner arms from the wrists to the tops of the shoulders. Firm your shoulder blades against your back, then widen them and draw them toward your tailbone. Keep your head between your upper arms.',
        'Stay in the pose for 10 or more breaths, then bend your knees on an exhalation and lower yourself into Child’s Pose'
    
    ],
    Chair: [
        'Stand straight and tall with your feet slightly wider than hip­-width apart and your arms at your sides.',
        'Inhale and lift your arms next to your ears, stretching them straight and parallel with wrists and fingers long. Keep your shoulders down and spine neutral.',
        'Exhale as you bend your knees, keeping your thighs and knees parallel. Lean your torso forward to create a right angle with the tops of your thighs. Keep your neck and head in line with your torso and arms. Hold for 30 seconds to 1 minute.'
    ],
    Warrior: [
        'Begin in lunge with your front knee bent, your back leg straight and your back heel lifted. Your hips and chest should be squared to front of the mat. Raise your arms above your head.',
        'Move your hands to your heart, with palms pressed against each other in a prayer position. Lean forward until your back leg extends straight back, even with your hips. Keep your foot flexed and your gaze downward.',
        'Make sure your standing leg is strong and straight, but not locked at knee. Reach your arms forward so your body forms a “T” shape.'
    ]
}

const poseImages = {
    Tree: tree,
    Cobra: cobra,
    Dog: dog,
    Warrior: warrior,
    Chair: chair
}

export default function Instructions({ currentPose }) {

    

    return (
        <div className="instructions-container">
            <ul className="instructions-list">
                {poseInstructions[currentPose].map((instruction) => {
                    return(
                        <li className="instruction">{instruction}</li>
                    )
                    
                })}
            </ul>
            <img 
                className="pose-demo-img"
                src={poseImages[currentPose]}
                alt="yoga poses"
            />
        </div>
    )
}
