import {div, input, p, button} from '@cycle/dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

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
  const { inputTodo$, clickAddTodo$ } = actions;

  const currentTodo$ = inputTodo$
    .map(ev => ev.target.value)
    .startWith('');

  const addTodo$ = clickAddTodo$
    .compose(sampleCombine(currentTodo$))
    .map(([_, todo]) => todo)
    .startWith(null);

  return { currentTodo$, addTodo$ };
}

function view(state) {
  const { currentTodo$ } = state;

  return currentTodo$.map(todo =>
    div([
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
