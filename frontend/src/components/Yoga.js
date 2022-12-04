import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import './Yoga.css'
import DropDown from './DropDown';
import Instructions from './Instructions'
import count from './count/count.mp3'

let skeletonColor = 'rgb(255,255,255)'
let poseList = [
  'Chair', 'Tree', 'Cobra', 'Warrior', 'Dog'
]

let interval

const POINTS = {
  NOSE : 0,
  LEFT_EYE : 1,
  RIGHT_EYE : 2,
  LEFT_EAR : 3,
  RIGHT_EAR : 4,
  LEFT_SHOULDER : 5,
  RIGHT_SHOULDER : 6,
  LEFT_ELBOW : 7,
  RIGHT_ELBOW : 8,
  LEFT_WRIST : 9,
  RIGHT_WRIST : 10,
  LEFT_HIP : 11,
  RIGHT_HIP : 12,
  LEFT_KNEE : 13,
  RIGHT_KNEE : 14,
  LEFT_ANKLE : 15,
  RIGHT_ANKLE : 16,
}

const keypointConnections = {
  nose: ['left_ear', 'right_ear'],
  left_ear: ['left_shoulder'],
  right_ear: ['right_shoulder'],
  left_shoulder: ['right_shoulder', 'left_elbow', 'left_hip'],
  right_shoulder: ['right_elbow', 'right_hip'],
  left_elbow: ['left_wrist'],
  right_elbow: ['right_wrist'],
  left_hip: ['left_knee', 'right_hip'],
  right_hip: ['right_knee'],
  left_knee: ['left_ankle'],
  right_knee: ['right_ankle']
}

let flag = false

function drawSegment(ctx, [mx, my], [tx, ty], color) {
  ctx.beginPath()
  ctx.moveTo(mx, my)
  ctx.lineTo(tx, ty)
  ctx.lineWidth = 5
  ctx.strokeStyle = color
  ctx.stroke()
}

function drawPoint(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function Yoga() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)


  const [startingTime, setStartingTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [poseTime, setPoseTime] = useState(0)
  const [currentPose, setCurrentPose] = useState('Chair')
  const [isStartPose, setIsStartPose] = useState(false)
  const countAudio = new Audio(count)
  
  useEffect(() => {
    const timeDiff = (currentTime - startingTime)/1000
    if(flag) {
      setPoseTime(timeDiff)
    }
   //eslint-disable-next-line
  }, [currentTime])


  useEffect(() => {
    setCurrentTime(0)
    setPoseTime(0)
  }, [currentPose])
 

  const CLASS_NO = {
    Chair: 0,
    Cobra: 1,
    Dog: 2,
    Tree: 3,
    Warrior: 4,
  }

  function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1)
    let right = tf.gather(landmarks, right_bodypart, 1)
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5))
    return center
    
  }

  function get_pose_size(landmarks, torso_size_multiplier=2.5) {
    let hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    let shoulders_center = get_center_point(landmarks,POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER)
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center))
    let pose_center_new = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    pose_center_new = tf.expandDims(pose_center_new, 1)

    pose_center_new = tf.broadcastTo(pose_center_new,
        [1, 17, 2]
      )
      // return: shape(17,2)
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0)
    let max_dist = tf.max(tf.norm(d,'euclidean', 0))

    // normalize scale
    let pose_size = tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist)
    return pose_size
  }

  function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    
    pose_center = tf.expandDims(pose_center, 1)
    
    pose_center = tf.broadcastTo(pose_center, 
        [1, 17, 2]
      )
    landmarks = tf.sub(landmarks, pose_center)

    let pose_size = get_pose_size(landmarks)
    landmarks = tf.div(landmarks, pose_size)
    return landmarks
  }

  function landmarks_to_embedding(landmarks) {
    // normalize landmarks 2D
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0))
    let embedding = tf.reshape(landmarks, [1,34])
    return embedding
  }

  const runMovenet = async () => {
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    const poseClassifier = await tf.loadLayersModel('https://raw.githubusercontent.com/Ankit09092001/yoga_model/main/model/model.json')
  
    interval = setInterval(() => { 
        detectPose(detector, poseClassifier, countAudio)
    }, 100)
  }

  const detectPose = async (detector, poseClassifier, countAudio) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      let notDetected = 0 
      const video = webcamRef.current.video
      const pose = await detector.estimatePoses(video)
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      try {
        const keypoints = pose[0].keypoints 
        let input = keypoints.map((keypoint) => {
          if(keypoint.score > 0.4) {
            
              drawPoint(ctx, keypoint.x, keypoint.y, 8, 'rgb(255,255,255)')
              let connections = keypointConnections[keypoint.name]
              try {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase()
                  drawSegment(ctx, [keypoint.x, keypoint.y],
                      [keypoints[POINTS[conName]].x,
                       keypoints[POINTS[conName]].y]
                  , skeletonColor)
                })
              } catch(err) {

              }
              
            
          } else {
            notDetected += 1
          } 
          return [keypoint.x, keypoint.y]
        }) 
        if(notDetected > 4) {
          skeletonColor = 'rgb(255,255,255)'
          return
        }
        
        const processedInput = landmarks_to_embedding(input)
        const classification = poseClassifier.predict(processedInput)
        
        classification.array().then((data) => {   
                
          const classNo = CLASS_NO[currentPose]
          
          if(data[0][classNo] > 0.97) {
            console.log(data[0][classNo])
            if(!flag) {
              setStartingTime(new Date(Date()).getTime())
              countAudio.play()
              flag = true
            }
            setCurrentTime(new Date(Date()).getTime()) 
            skeletonColor = 'rgb(0,255,0)'
          } else {
            countAudio.pause()
            countAudio.currentTime=0
            flag = false
            skeletonColor = 'rgb(255,255,255)'
           
          }
        })
      } catch(err) {
        console.log(err)
      }
      
      
    }
  }

  function startYoga(){
    setIsStartPose(true) 
    runMovenet()
  } 

  function stopPose() {
    setIsStartPose(false)
    clearInterval(interval)
  }

    

  if(isStartPose) {
    return (
      <div className="yoga-container">
      
        <div className="performance-container">
            <div className="pose-performance">
              <h4>Pose Time: {poseTime} s</h4>
            </div>
        </div>

        <div>
          <Webcam 
          width='640px'
          height='480px'
          id="webcam"
          ref={webcamRef}
          style={{
            position: 'absolute',
            left: 450,
            top: 150,
            padding: '0px',
          }}
        />
          <canvas
            ref={canvasRef}
            id="my-canvas"
            width='640px'
            height='480px'
            style={{
              position: 'absolute',
              left: 450,
              top: 150,
              zIndex: 1
            }}
          >
          </canvas>
        
         
        </div>
        <button
          onClick={stopPose}
          className="secondary-btn"    
        >Stop Pose</button>
      </div>
    )
  }

  return (
    <div className="yoga-container">


      <DropDown
        poseList={poseList}
        currentPose={currentPose}
        setCurrentPose={setCurrentPose}
      />
      <Instructions
          currentPose={currentPose}
        />
      
      <button
          onClick={startYoga}
          className="secondary-btn"    
        >Start Pose</button>
    </div>
  )
}

export default Yoga;