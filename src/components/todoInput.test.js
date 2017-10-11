import { mockDOMSource } from '@cycle/dom';
import { mockTimeSource } from '@cycle/time';
import { select } from 'snabbdom-selector';
import { expect } from 'chai';

import TodoInput from './todoInput';

describe('TodoInput', function() {
  it('renders the input on p tag', function(done) {
    const Time = mockTimeSource();
    const toEvent = (value) => ({ target: { value } })

    const input$ = Time.diagram(
      '--a-b-c-d-|',
      {a: 't', b: 'to', c: 'tod', d: 'todo'}
    ).map(toEvent);

    const expectedTodo$ = Time.diagram(
      'a-b-c-d-e-|',
      {a: '', b: 't', c: 'to', d: 'tod', e: 'todo'}
    )

    const DOM = mockDOMSource({
      '#todo-input': {
        input: input$
      }
    })

    const todoInputSink = TodoInput({DOM});

    const todoInput$ = todoInputSink.DOM.map(vtree => select('.current-todo', vtree)[0].text)

    Time.assertEqual(todoInput$, expectedTodo$);
    Time.run(done)
  })

  it('emits addTodo$', function(done) {
    const Time = mockTimeSource();
    const toEvent = (value) => ({ target: { value } })

    const input$ = Time.diagram(
      '--a-b-c-d-|',
      {a: 't', b: 'to', c: 'tod', d: 'todo'}
    ).map(toEvent);

    const click$ = Time.diagram(`---------x|`)

    const expectedTodo$ = Time.diagram(
      `---------x|`,
      {
        x: {"title": 'todo', "completed": false}
      }
    )

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

    Time.run(done);
  })
})
