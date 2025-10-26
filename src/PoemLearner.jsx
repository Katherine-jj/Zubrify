import React, { useState } from 'react';
import PoemEditor from './components/PoemEditor';
import PoemView from './components/PoemView';
import PoemTrainer from './components/PoemTrainer';

export default function PoemLearner() {
  const [poemData, setPoemData] = useState({
    title: '',
    author: '',
    text: '',
  });
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="poem-learner">
      {!isSaved ? (
        <PoemEditor
          poemData={poemData}
          setPoemData={setPoemData}
          setIsSaved={setIsSaved}
        />
      ) : (
        <>
          <PoemView {...poemData} />
          <PoemTrainer poemData={poemData} />
        </>
      )}
    </div>
  );
}
