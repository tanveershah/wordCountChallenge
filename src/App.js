import React, { useEffect, useState } from 'react';
import { compose } from 'ramda';
import 'whatwg-fetch';
import './index.css';

const Counter = (props) => {
  const [values, setValues] = useState({
    text: '',
    characters: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
  });

  useEffect(() => {
    fetch(counter(values.text)).catch((err) =>
      setValues({ text: `Error: ${err.message}` })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // this function removes line breaks
  const discardBreaks = (array) => {
    let idx;

    while (
      (idx = array.findIndex((element) => element.match(/\r?\n|\r/g))) !== -1
    ) {
      // const idx = array.findIndex((element) => element.match(/\r?\n|\r/g));
      array = [
        ...array.slice(0, idx),
        ...array[idx].split(/\r?\n|\r/),
        ...array.slice(idx + 1, array.length),
      ];
    }

    return array;
  };

  // Multiple spaces and return keys will result in empty elements in the array,
  // discardEmptyElements function will remove them.

  const discardEmptyElements = (array) => {
    let idx;

    while ((idx = array.findIndex((element) => element.trim() === '')) !== -1) {
      array.splice(idx, 1);
    }
    return array;
  };

  const counter = (string) => {
    const cleanText = string.trim();
    const wordArray = compose(
      discardEmptyElements,
      discardBreaks
    )(cleanText.split(' '));
    const sentenceArray = compose(
      discardEmptyElements,
      discardBreaks
    )(cleanText.split('.'));
    const paraArray = discardEmptyElements(cleanText.split(/\r?\n|\r/));

    setValues({
      text: string,
      characters: cleanText.length,
      words: string === '' ? 0 : wordArray.length,
      sentences: string === '' ? 0 : sentenceArray.length,
      paragraphs: string === '' ? 0 : paraArray.length,
    });
  };

  // const wordFrequency = (array) => {
  //   let text
  //   let counts = {}
  //   const keys = []

  //   function
  // }

  const handleChange = (e) => {
    if (e.target.id === 'myFile') {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function () {
        counter(reader.result);
      };
      reader.readAsText(file);
    } else {
      counter(e.target.value);
    }
  };

  return (
    <div>
      <h2 className="title">Text Analysis</h2>
      <textarea
        rows="15"
        onChange={handleChange}
        value={values.text}
      ></textarea>
      <p className="headings">
        <b>Character count: </b>
        {values.characters}
        <br />
        <b>Words count: </b>
        {values.words}
        <br />
        <b>Sentence count: </b>
        {values.sentences}
        <br />
        <b>paragraph count: </b>
        {values.paragraphs}
        <br />
      </p>
      <div>
        <input
          type="file"
          id="myFile"
          placeholder="Choose Text File"
          onChange={handleChange}
        />
        {/* <input type="submit" id="file-submit" onChange={handleChange} /> */}
      </div>
    </div>
  );
};

export default Counter;
