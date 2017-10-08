import {div, input, p, button} from '@cycle/dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import todoInput from './components/todoInput'
import todoList from './components/todoList'

export function App (sources) {
  const filterDeleted = ([currentList, deletedList]) =>
    currentList.filter(item => !item.includes(deletedList))

  const todoInputSink = todoInput(sources);

  const {addTodo$} = todoInputSink.state;

  const todoes$ = addTodo$
    .fold((todoes, todo) => [...todoes, todo], []);

  const deleteTodoProxy$ = xs.create();

  const deleteTodoes$ = deleteTodoProxy$
    .fold((todoes, todo) => [...todoes, todo], []);

  const visibleTodoes$ = xs.combine(todoes$, deleteTodoes$)
    .map(filterDeleted)

  const todoListSink = todoList({DOM: sources.DOM, props: { todo$: visibleTodoes$ }});

  const {deleteTodo$} = todoListSink.state;

  deleteTodoProxy$.imitate(deleteTodo$);

  const vdom$ = xs.combine(todoInputSink.DOM, todoListSink.DOM).map(([todoInput, todoList]) =>
    div([
      todoInput,
      todoList,
    ])
  )

  return { DOM: vdom$ }
}
