import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import uuid from 'uuid/v4';
import _ from 'lodash';

@ObjectType()
class Todo {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  isComplete: boolean;
}

const getDefaultTodos = (): Todo[] => [
  {
    id: 'todo-1',
    name: 'Do work',
    isComplete: false,
  },
  {
    id: 'todo-2',
    name: 'Pick up groceries',
    isComplete: false,
  },
];

let todos = getDefaultTodos();

export const getAllTodos = async () => todos;

@InputType()
class NewTodoInput {
  @Field()
  name: string;

  @Field()
  isComplete: boolean;
}

@Resolver(Todo)
export class TodosResolver {
  @Query(returns => [Todo])
  async todos() {
    return await getAllTodos();
  }

  @Mutation(returns => Todo)
  async addTodo(@Arg('newTodo') newTodoInput: NewTodoInput): Promise<Todo> {
    const foundTodo = _.find(todos, todo => todo.name === newTodoInput.name);
    if (!foundTodo) {
      const newTodo = {
        ...newTodoInput,
        id: uuid(),
      };
      todos.push(newTodo);
      return newTodo;
    }

    return foundTodo;
  }
}
