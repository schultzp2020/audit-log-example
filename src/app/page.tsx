"use client"

import { LOG_LEVELS } from '@/logger/constants';

export default function Home() {
  return (
    <main>
      <div className="flex justify-center items-center h-screen gap-2 flex-col">
        <div className='flex gap-2 items-center'>
          <h3>Log:</h3>
          {Object.keys(LOG_LEVELS).map((level) => <button key={level} className="border rounded-md p-2 hover:bg-slate-700 active:bg-slate-600" onClick={
          () => {
            fetch('/api/logger', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ level, message: `${level} logged` })
            }).then(response => response.json()).then(data => console.log(data))
          }
        }>{level}</button>)}
        </div>
        <div className='flex gap-2 items-center'>
          <h3>Audit Log:</h3>
          {Object.keys(LOG_LEVELS).map((level) => <button key={level} className="border rounded-md p-2 hover:bg-slate-700 active:bg-slate-600" onClick={
          () => {
            fetch('/api/logger', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ level, message: `Audit Log - ${level} logged`, isAuditLog: true })
            }).then(response => response.json()).then(data => console.log(data))
          }
        }>{level}</button>)}
        </div>
      </div>
    </main>
  );
}
