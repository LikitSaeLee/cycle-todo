import { expect } from 'chai'
import { validTodo, completedTodo, todoFromTitle } from './todo';

describe('#validTodo', () => {
  context('when title is present', () => {
    it('returns true', () => {
      const todo = { title: 'do some tests' }

      expect(validTodo(todo)).to.equal(true)
    })
  })

  context('when title is empty', () => {
    it('returns false', () => {
      const todo = { title: '' }

      expect(validTodo(todo)).to.equal(false)
    })
  })
})

describe('#completeTodo', () => {
  context('when completed is true', () => {
    it('returns true', () => {
      const todo = { completed: true }

      expect(completedTodo(todo)).to.equal(true)
    })
  })

  context('when completed is false', () => {
    it('returns false', () => {
      const todo = { completed: false }

      expect(completedTodo(todo)).to.equal(false)
    })
  })
})

describe('#todoFromTitle', () => {
  it('constructs todo', () => {
    const todo = todoFromTitle('write more test!');

    expect(todo)
      .to.have.property('title')
      .that.is.equal('write more test!')

    expect(todo)
      .to.have.property('completed')
      .that.is.equal(false)
  })
})
