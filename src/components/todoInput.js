import {div, input, p, button, h1} from '@cycle/dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import { path, last } from 'ramda';

function intent(domSource) {
  const inputTodo$ = domSource.
    select('#todo-input').
    events('input');

  const clickAddTodo$ = domSource.
    select('#todo-button').
    events('click');

  return { inputTodo$, clickAddTodo$ };
}

function model(actions) {
  const eventValue = path(['target', 'value'])
  const todoFromTitle = (title) => ({title: title, completed: false})

  const { inputTodo$, clickAddTodo$ } = actions;

  const currentTodo$ = inputTodo$
    .map(eventValue)
    .startWith('');

  const addTodo$ = clickAddTodo$
    .compose(sampleCombine(currentTodo$))
    .map(last)
    .map(todoFromTitle)

  return { currentTodo$, addTodo$ };
}

function view(state) {
  const { currentTodo$ } = state;

  return currentTodo$.map(todo =>
    div('.todo-input-container', [
      h1('.todo-title', 'Cycle Todo App'),
      input('#todo-input'),
      button('#todo-button', 'Add'),
      p(todo),
    ])
  )

}

export default function todoInput(sources) {
  const actions = intent(sources.DOM);
  const state = model(actions);

  const vtree$ = view(state);

  const sinks = {
    DOM: vtree$,
    state,
  }
  return sinks
}
