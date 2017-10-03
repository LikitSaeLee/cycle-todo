import {div, input, p, button} from '@cycle/dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

function renderTodoList(todoes) {
  return div(todoes.filter(todo => todo).map(todo => p('.todo-item', todo)))
}

function intent(domSource) {
  const deleteTodo$ = domSource
    .select('.todo-item')
    .events('click')
    .map(ev => ev.target.textContent)
    .startWith([]);

  return { deleteTodo$ }
}

function model(actions, todo$) {

  const { deleteTodo$ } = actions;

  const deletedTodoes$ = deleteTodo$
    .fold((todoes, todo) => [...todoes, todo], []);

  const todoes$ = todo$
    .fold((todoes, todo) => [...todoes, todo], []);

  return { deletedTodoes$, todoes$ }
}

function view(state) {
  const {todoes$, deletedTodoes$} = state;

  return xs
    .combine(todoes$, deletedTodoes$)
    .map(([todoes, deletedTodoes]) =>
      todoes.filter(todo => !deletedTodoes.includes(todo))
    )
    .map(todoes => renderTodoList(todoes));
}

export default function todoList(sources) {
  const { todo$ } = sources.props;

  const actions = intent(sources.DOM);
  const state = model(actions, todo$);
  const vdom$ = view(state);

  return {
    DOM: vdom$
  }
}
