import {div, input, p, button} from '@cycle/dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

function renderTodoList(todoes) {
  return div(todoes.filter(todo => todo).map(todo => p('.todo-item', todo)))
}

function intent(domSource) {
  const clickTodo$ = domSource
    .select('.todo-item')
    .events('click')

  return { clickTodo$ }
}

function model(actions) {
  const { clickTodo$ } = actions;

  const deleteTodo$ = clickTodo$
    .map(ev => ev.target.textContent);

  return { deleteTodo$ }
}

function view(state, todoes$) {
  return todoes$
    .map(todoes => renderTodoList(todoes));
}

export default function todoList(sources) {
  const { todoes$ } = sources.props;

  const actions = intent(sources.DOM);
  const state = model(actions);
  const vdom$ = view(state, todoes$);

  return {
    DOM: vdom$,
    state,
  }
}
