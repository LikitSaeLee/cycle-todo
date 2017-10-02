import {div, input, p, button} from '@cycle/dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import todoInput from './components/todoInput'
import todoList from './components/todoList'

export function App (sources) {
  const todoes$ = xs.create();

  const todoInputSink = todoInput(sources);

  const {clickAddTodo$, currentTodo$} = todoInputSink;

  const todo$ = clickAddTodo$
    .compose(sampleCombine(currentTodo$))
    .map(([_, todo]) => todo)
    .startWith(null);

  const todoListSink = todoList({DOM: sources.DOM, props: { todoes$: todo$ }});

  const {deleteTodo$} = todoListSink;

  const vdom$ = xs.combine(todoInputSink.DOM, todoListSink.DOM).map(([todoInput, todoList]) =>
    div([
      todoInput,
      todoList,
    ])
  )

  return { DOM: vdom$ }
}
