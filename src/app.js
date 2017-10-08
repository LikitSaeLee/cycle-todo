import {div, input, p, button} from '@cycle/dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import todoInput from './components/todoInput'
import todoList from './components/todoList'

export function App (sources) {
  const combineTodoAction = ([currentTodoes, completedList, deletedList]) => {
    return currentTodoes.map(todo => {
      if (deletedList.includes(todo.title)) {
        return {title: '', completed: false}
      }

      if (completedList.includes(todo.title)) {
        return {title: todo.title, completed: true}
      }

      return todo;
    })
  }

  const collectCompleted = (todoes, newTodo) => {
    if (todoes.includes(newTodo)) {
      // remove it
      return todoes.filter(todo => todo !== newTodo)
    }

    return [...todoes, newTodo]
  }

  const todoInputSink = todoInput(sources);

  const {addTodo$} = todoInputSink.state;

  const addTodoes$ = addTodo$
    .fold((addTodoes, todo) => [...addTodoes, todo], []);

  const completeTodoProxy$ = xs.create();

  const removeTodoProxy$ = xs.create();

  const completeTodoes$ = completeTodoProxy$
    .fold(collectCompleted, []);

  const removeTodoes$ = removeTodoProxy$
    .fold((todoes, todo) => [...todoes, todo], []);

  const todoes$ = xs.combine(addTodoes$, completeTodoes$, removeTodoes$)
    .map(combineTodoAction);

  const todoListSink = todoList({DOM: sources.DOM, props: { todoes$ }});

  const {completeTodo$, removeTodo$} = todoListSink.state;

  completeTodoProxy$.imitate(completeTodo$);
  removeTodoProxy$.imitate(removeTodo$);

  const vdom$ = xs.combine(todoInputSink.DOM, todoListSink.DOM).map(([todoInput, todoList]) =>
    div([
      todoInput,
      todoList,
    ])
  )

  return { DOM: vdom$ }
}
