import {div, input, p, button} from '@cycle/dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

function renderTodoList(todoes) {
  return div(todoes.filter(todo => todo).map(todo => p('.todo-item', todo)))
}

export default function todoList(sources) {
  const { todo$ } = sources.props;

  const deleteTodo$ = sources
    .DOM
    .select('.todo-item')
    .events('click')
    .map(ev => ev.target.textContent)
    .startWith([]);

  const deletedTodoes$ = deleteTodo$
    .fold((todoes, todo) => [...todoes, todo], []);

  const todoes$ = todo$
    .fold((todoes, todo) => [...todoes, todo], [])

  const vdom$ = xs
    .combine(todoes$, deletedTodoes$)
    .map(([todoes, deletedTodoes]) =>
      todoes.filter(todo => !deletedTodoes.includes(todo))
    )
    .map(todoes => renderTodoList(todoes));

  return {
    DOM: vdom$,
    deleteTodo$,
  }
}
