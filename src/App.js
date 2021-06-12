import React, { Component } from 'react';
import { compose } from 'ramda';
import 'whatwg-fetch';
import './index.css';

class Counter extends Component {
  state = {
    text: '',
    characters: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
  };

  componentDidMount() {
    this.getText()
      .then((content) => {
        this.setState({ text: content.join('\n\n') }, () =>
          this.counter(this.state.text)
        );
      })
      .catch((err) => this.setState({ text: `Error: ${err.message}` }));
  }

  // getText gets first three paragraphs from https://baconipsum.com
  getText = async () => {
    const paras = await fetch(
      'https://baconipsum.com/api/?type=all-meat&paras=3'
    );
    const body = paras.json();

    if (paras.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };

  // this function removes line breaks
  discardBreaks = (array) => {
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
    return this.discardBreaks(cleanArray);
  };

  // Multiple spaces and return keys will result in empty elements in the array,
  // discardEmptyElements function will remove them.

  discardEmptyElements = (array) => {
    const idx = array.findIndex((element) => element.trim() === '');

    // base case
    if (idx === -1) {
      return array;
    }

    array.splice(idx, 1);

    // recursive case
    return this.discardEmptyElements(array);
  };

  counter = (string) => {
    const cleanText = string.trim();
    const wordArray = compose(
      this.discardEmptyElements,
      this.discardBreaks
    )(cleanText.split(' '));
    const sentenceArray = compose(
      this.discardEmptyElements,
      this.discardBreaks
    )(cleanText.split('.'));
    const paraArray = this.discardEmptyElements(cleanText.split(/\r?\n|\r/));

    this.setState({
      text: string,
      characters: cleanText.length,
      words: string === '' ? 0 : wordArray.length,
      sentences: string === '' ? 0 : sentenceArray.length,
      paragraphs: string === '' ? 0 : paraArray.length,
    });
  };

  handleChange = (e) => this.counter(e.target.value);

  render() {
    return (
      <div>
        <textarea
          rows="15"
          onChange={this.handleChange}
          value={this.state.text}
        ></textarea>
        <p>
          <b>Character count: </b>
          {this.state.characters}
          <br />
          <b>Words count: </b>
          {this.state.words}
          <br />
          <b>Sentence count: </b>
          {this.state.sentences}
          <br />
          <b>paragraph count: </b>
          {this.state.paragraphs}
          <br />
        </p>
      </div>
    );
  }
}

export default Counter;
