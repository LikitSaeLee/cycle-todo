import {div, input, p, button} from '@cycle/dom'
import xs from 'xstream'

function intent(domSource) {
  const inputTodo$ = domSource.
    select('#todo-input').
    events('input');

  const clickAddTodo$ = domSource.
    select('#add-todo-btn').
    events('click');

  return { inputTodo$, clickAddTodo$ };
}

function model(actions) {
  const { inputTodo$, clickAddTodo$ } = actions;

  const todo$ = inputTodo$
    .map(ev => ev.target.value)
    .startWith('');

  const addTodo$ = clickAddTodo$
    .map(() => todo$.last())
    .startWith('Add a todo now.');

  return { todo$, addTodo$ };
}

function view(state) {
  const { addTodo$, todo$ } = state;

  return xs.combine(addTodo$, todo$).map(([addTodo, todo]) =>
    div([
      input('#todo-input'),
      button('#add-todo-btn', 'Add Todo'),
      p(todo),
      p(addTodo),
    ])
  )

}

export function App (sources) {
  const actions = intent(sources.DOM);
  const state = model(actions);
  const vtree$ = view(state);

  const sinks = {
    DOM: vtree$,
    Log: (addTodo$) => {
      addTodo$.subscribe({
        next: (todo) => { console.log(`New Todo: ${todo}`) },
        error: (err) => {},
        completed: () => {},
      });
    }
  }
  return sinks
}
