import React from 'react'
import PoemLearner from './PoemLearner'


export default function App() {
    return (
        <div className="app">
            <header>
                <h1>прототип</h1>
                <p>Вставьте стих</p>
            </header>
            <main>
                <PoemLearner />
            </main>
        </div>
    )
}