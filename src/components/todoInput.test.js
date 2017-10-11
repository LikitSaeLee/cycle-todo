import {mockDOMSource} from '@cycle/dom';
import {mockTimeSource} from '@cycle/time';
import {select} from 'snabbdom-selector';
import { expect } from 'chai';

import TodoInput from './todoInput';

describe('TodoInput', () => {
  it('emits addTodo$', () => {
    const Time = mockTimeSource();

    const input$ = Time.
      diagram(
        '--a-b-c-d-|',
        {a: 't', b: 'to', c: 'tod', d: 'todo'}
      )
      .map(v => ({ target: { value: v } }));

    const click$ = Time.diagram('---------x|')

    const expectedTodo$ = Time.diagram('---------x|', {x: 'todo'})

    const DOM = mockDOMSource({
      '#todo-input': {
        input: input$
      },
      '#todo-button': {
        click: click$
      }
    })

    const todoInputSink = TodoInput({DOM});

    const { addTodo$ } = todoInputSink.state;

    Time.assertEqual(addTodo$, expectedTodo$)
    Time.run();
  })

  it('runs', () => {
    expect(1+1).to.equal(2)
  })
})
