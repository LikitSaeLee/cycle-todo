import {div, input, p, button} from '@cycle/dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import R from 'ramda'
import { validTodo, completedTodo } from '../modules/todo'

function renderTodoList(todoes) {
  const visibleTodoes = todoes.filter(validTodo);

  if (R.isEmpty(visibleTodoes)) {
    return div();
  }

  return div('.todo-list',
    visibleTodoes
    .map(todoItem)
  )
}

function todoItem(todo) {
  if (completedTodo(todo)) {
    const style = { textDecoration: 'line-through' }

    return div('.todo-list-item', [
      p('.todo-item', { style }, todo.title),
      button('.remove', 'Remove')
    ])
  }

  return div('.todo-list-item', [
    p('.todo-item', todo.title),
    button('.remove', 'Remove')
  ])
}

function intent(domSource) {
  const clickTodo$ = domSource
    .select('.todo-item')
    .events('click')

  const clickRemoveTodo$ = domSource
    .select('.remove')
    .events('click');

  return { clickTodo$, clickRemoveTodo$ }
}

function model(actions) {
  const textContent = R.path(['target', 'textContent'])
  const previousSiblingTextContent = R.path(['target', 'previousSibling', 'textContent'])

  const { clickTodo$, clickRemoveTodo$ } = actions;

  const completeTodo$ = clickTodo$
    .map(textContent)

  const removeTodo$ = clickRemoveTodo$
    .map(previousSiblingTextContent)

  return { completeTodo$, removeTodo$ }
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
