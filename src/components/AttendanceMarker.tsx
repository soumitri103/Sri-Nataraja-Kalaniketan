import {useState} from 'react';
import {faceEngine} from '../core/faceEngine';
import {AttendanceDB} from '../core/database';
import CameraCapture from './CameraCapture';

function AttendanceMarker(){const [step,setStep]=useState<'session'|'capture'|'result'>('session');const [sessionId,setSessionId]=useState('');const [className,setClassName]=useState('');const [attendance,setAttendance]=useState<any[]>([]);const [result,setResult]=useState<any>(null);

const handleStartSession=(e:React.FormEvent)=>{e.preventDefault();if(!sessionId||!className){alert('Please fill fields');return;}
AttendanceDB.saveSession({id:sessionId,className,date:new Date().toISOString().split('T')[0],startTime:Date.now()});setAttendance([]);setStep('capture');};

const handleFaceCapture=async(canvas:HTMLCanvasElement)=>{try{const match=await faceEngine.verifyFace(canvas);if(match){const student=AttendanceDB.getStudent(match.userId);const record={id:Date.now().toString(),sessionId,studentId:match.userId,timestamp:Date.now(),confidence:match.confidence,status:'present'as const};AttendanceDB.saveAttendance(record);setAttendance([...attendance,{...record,name:student?.name}]);setResult({success:true,name:student?.name,confidence:(match.confidence*100).toFixed(1)});}else{setResult({success:false,message:'Face not recognized'});}}catch(error){setResult({success:false,message:'Error processing'});}};

return(<div className="attendance-container">{step==='session'&&(<form onSubmit={handleStartSession}><h2>Start Session</h2><input value={sessionId} onChange={(e)=>setSessionId(e.target.value)} placeholder="Session ID" required/><input value={className} onChange={(e)=>setClassName(e.target.value)} placeholder="Class Name" required/><button className="btn-primary">Start</button></form>)}{step==='capture'&&(<div><h2>{className}</h2><p>Marked:{attendance.length}</p><CameraCapture onCapture={handleFaceCapture}/>{result&&<div className={result.success?'success':'error'}>{result.success?`✓ ${result.name}`:result.message}</div>}<button onClick={()=>setStep('result')}>End</button></div>)}{step==='result'&&(<div><h2>Summary</h2><p>Total:{attendance.length}</p><button onClick={()=>{setStep('session');setSessionId('');setClassName('');setAttendance([]);}}>New Session</button></div>)}</div>);}export default AttendanceMarker;
