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
    const idx = array.findIndex((element) => element.match(/\r?\n|\r/g));

    // Base case
    if (idx === -1) {
      return array;
    }

    const cleanArray = [
      ...array.slice(0, idx),
      ...array[idx].split(/\r?\n|\r/),
      ...array.slice(idx + 1, array.length),
    ];

    // recurvsive case
    return discardBreaks(cleanArray);
  };

  // Multiple spaces and return keys will result in empty elements in the array,
  // discardEmptyElements function will remove them.

  const discardEmptyElements = (array) => {
    const idx = array.findIndex((element) => element.trim() === '');

    // base case
    if (idx === -1) {
      return array;
    }

    array.splice(idx, 1);

    // recursive case
    return discardEmptyElements(array);
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

  const handleChange = (e) => counter(e.target.value);

  return (
    <div>
      <textarea
        rows="15"
        onChange={handleChange}
        value={values.text}
      ></textarea>
      <p>
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
    </div>
  );
};

export default Counter;
