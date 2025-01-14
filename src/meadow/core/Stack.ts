/*
 *
 *  Copyright (c) 2025 Nio Kasgami. All rights reserved.
 *
 *  Meadow Engine is a 2D game engine built with PixiJS as its foundation.
 *  This engine is licensed under the MIT License, the same terms as PixiJS.
 *
 *  Permission is hereby granted, free of charge, to use, copy, modify, merge, publish, distribute,
 *  sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  - The above copyright notice and this permission notice shall be included in all copies or
 *    substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 *  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 *  PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 *  FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 *  ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 *
 */

/**
 * A generic class that implements a stack-like data structure.
 *
 * This class follows the **Last In, First Out (LIFO)** principle, meaning that the most recently added
 * element will always be the first one to be removed.
 *
 * @template T - The type of the elements stored in the stack.
 *
 * @example
 * const stack = new Stack(1, 2, 3);
 * stack.push(4); // Adds 4 to the stack
 * console.log(stack.pop()); // Output: 4 (Most recently added element)
 * console.log(stack.peek()); // Output: 3 (Top element)
 * console.log(stack.size()); // Output: 3 (Stack size)
 */
export class Stack<T> {

  private _items : T[];

  /**
   * Creates a new instance of the Stack class.
   *
   * Initializes the stack with the provided elements.
   *
   * @param items - The elements to initialize the stack with.
   */
  constructor(...items: T[]) {
    this._items = [...items];
  }

  /**
   * Prints the elements of the stack and other relevant information.
   *
   * @returns {string} - A string representing the stack's elements and its size.
   */
  public print(): string {
    // Using map to construct an array of formatted strings for each element
    const elementsInfo = this._items.map((item, index) => {
      return `Element ${index}: ${item?.constructor?.name || 'Unknown Type'}`;
    });

    // Joining the elements info and adding the stack size at the end
    return [...elementsInfo, `Stack size: ${this._items.length}`].join("\n");
  }

  /**
   * Adds one or more elements to the top of the stack.
   *
   * @param elements - The elements to push onto the stack.
   */
  public push(...elements: T[]){
    this._items.push(...elements);
  }

  /**
   * Removes and returns the most recently added element from the stack.
   *
   * @returns {T | undefined} - The top element of the stack, or `undefined` if the stack is empty.
   */
  public pop(): T | undefined {
    return this._items.pop();
  }

  /**
   * Returns the most recently added element without removing it.
   *
   * @returns {T} - The top element of the stack.
   * @throws {Error} - Throws an error if the stack is empty.
   */
  public peek(): T {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this._items[this._items.length - 1];
  }

  /**
   * Checks whether the stack is empty.
   *
   * @returns {boolean} - `true` if the stack is empty, otherwise `false`.
   */
  public isEmpty(): boolean {
    return this._items.length === 0;
  }

  /**
   * Returns the number of elements currently in the stack.
   *
   * @returns {number} - The size of the stack.
   */
  public size(): number {
    return this._items.length;
  }

  /**
   * Removes all elements from the stack.
   */
  public clear(): void {
    this._items = [];
  }

  /**
   * Creates a shallow copy of the stack and returns it.
   *
   * @returns {Stack<T>} - A new Stack instance with the same elements.
   */
  public copy(): Stack<T> {
    return new Stack<T>(...this._items);
  }

  /**
   * Converts the stack to an array and returns it as a shallow copy.
   *
   * @returns {Array<T>} - A shallow copy of the stack as an array.
   */
  public toArray(): T[] {
    return [...this._items];
  }
}

