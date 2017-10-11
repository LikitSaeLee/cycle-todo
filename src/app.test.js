import { mockDOMSource } from '@cycle/dom';
import { mockTimeSource } from '@cycle/time';
import { select } from 'snabbdom-selector';
import { expect } from 'chai';

import App from './app';

describe('App', function() {
  it('renders todoes', function(done) {
    const Time = mockTimeSource();

    const storage = Time.diagram(
      '-x--------|',
      {
        x: JSON.stringify([
          { title: 'todo 1', completed: false },
          { title: 'todo 2', completed: false }
        ])
      }
    )

    const expectedTodoList$ = Time.diagram(
      'x|',
      {
        x: ['todo 1', 'todo 2']
      }
    )
    const DOM = mockDOMSource()


    const AppSink = App({DOM, storage})

    const todoList$ = AppSink
      .DOM
      .map(vtree =>
        select('.todo-item').map(vNode => vNode.text)
      )

    Time.assertEqual(todoList$, expectedTodoList$);
    Time.run(done)
  })
})
