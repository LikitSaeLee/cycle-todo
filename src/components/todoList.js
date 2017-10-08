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

function model(actions, todo$) {
  const { clickTodo$ } = actions;

  const deleteTodo$ = clickTodo$
    .map(ev => ev.target.textContent)
    .startWith([]);

  const todoes$ = todo$
    .fold((todoes, todo) => [...todoes, todo], []);

  return { deleteTodo$, todoes$ }
}

function view(state) {
  const {todoes$} = state;

  return todoes$
    .map(todoes => renderTodoList(todoes));
}

export default function todoList(sources) {
  const { todo$ } = sources.props;

  const actions = intent(sources.DOM);
  const state = model(actions, todo$);
  const vdom$ = view(state);

  return {
    DOM: vdom$,
    state,
  }
}
