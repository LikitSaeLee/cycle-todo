import R from 'ramda'

export const validTodo = R.complement(R.propEq('title', ''))

export const completedTodo = R.propEq('completed', true);

export const todoFromTitle = (title) => ({title: title, completed: false})
