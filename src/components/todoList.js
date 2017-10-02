import {div, input, p, button} from '@cycle/dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

function renderTodoList(todoes) {
  return div(todoes.filter(todo => todo).map(todo => p('.todo-item', todo)))
}

export default function todoList(sources) {
  const { todoes$ } = sources.props;

  const deleteTodo$ = sources
    .DOM
    .select('.todo-item')
    .events('click')
    .map(ev => ev.target.textContent)
    .startWith([]);

  const vdom$ = todoes$
    .fold((todoes, todo) => [...todoes, todo], [])
    .map(todoes => renderTodoList(todoes));

  return {
    DOM: vdom$,
    deleteTodo$,
  }
}
