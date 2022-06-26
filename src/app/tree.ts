export class BinarySearchTreeNode<T> {
  data: T;
  leftNode?: BinarySearchTreeNode<T>;
  rightNode?: BinarySearchTreeNode<T>;

  constructor(data: T) {
    this.data = data;
  }
}

export class BinarySearchTree<T> {
  root?: BinarySearchTreeNode<T>;
  comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  insert(data: T): BinarySearchTreeNode<T> | undefined {
    //to implement
    const newNode = new BinarySearchTreeNode(data);

    // set newNode as the root if tree is empty
    if (this.root == null) {
      this.root = newNode;
      return;
    } else {
      // need to find the right place to insert the node
      let currentNode = this.root;
      let searchingForPosition = true;

      while (searchingForPosition) {
        if (currentNode.data == newNode.data) {
          // in binary search tree, there should be no duplicated value
          searchingForPosition = false;
          return;
        } else if (currentNode.data > newNode.data) {
          // check if there is existing left child node. if no, set currentNode.left as newNode
          // if there is a node, continue to move down
          if (currentNode.leftNode == null) {
            currentNode.leftNode = newNode;
            searchingForPosition = false;
            return;
          } else {
            currentNode = currentNode.leftNode;
          }
        } else if (currentNode.data < newNode.data) {
          // check if there is existing right child node. if no, set currentNode.right as newNode
          // if there is a node, continue to move down
          if (currentNode.rightNode == null) {
            currentNode.rightNode = newNode;
            searchingForPosition = false;
            return;
          } else {
            currentNode = currentNode.rightNode;
          }
        }
      }
    }
  }

  search(data: T): BinarySearchTreeNode<T> | undefined {
    //to implement

    // create a queue to queue up the nodes
    let queue = new Array(new BinarySearchTreeNode(data));

    // create an array to store all the nodes that already visited
    let visitedNodes = new Array(new BinarySearchTreeNode(data));

    // the idea is to do the following while the queue is not empty
    while (queue.length !== 0) {
      // 1. remove the first element from the queue
      let current = queue.shift();
      console.log(current);

      // 2. add the node to the visited array
      visitedNodes.push(current);
      // visitedNodes.push(current.data) - how come got error?

      // 3. if node has left child, add to the queue to be visited
      if (current.leftNode !== null) {
        queue.push(current.leftNode);
      }

      // 4. if node has right child, add to the queue to be visited
      if (current.rightNode !== null) {
        queue.push(current.rightNode);
      }
    }

    // 5. return array
    console.log(visitedNodes);
    return;
    // return visitedNodes - how come cannot return the array
  }

  // left - root - right
  inOrderTraversal(node: BinarySearchTreeNode<T> | undefined): void {
    let stack = new Array<BinarySearchTreeNode<T>>();
    let inOrderTraversalArray = new Array<T>();
    stack.push(node);

    while (stack.length > 0) {
      // node = stack.pop();

      // if node has left child, add to stack
      if (node.leftNode !== null) {
        stack.push(node.leftNode);
      }

      inOrderTraversalArray.push(node.data);

      if (node.rightNode !== null) {
        stack.push(node.rightNode);
      }
    }

    if (node) {
      this.inOrderTraversal(node.leftNode);
      console.log(node.data);
      this.inOrderTraversal(node.rightNode);
    }
    return;
    // return inOrderTraversalArray;
  }

  // root - left - right
  preOrderTraversal(node: BinarySearchTreeNode<T> | undefined): void {
    // create a stack
    let stack = new Array<BinarySearchTreeNode<T>>();

    // create array
    let preOrderTraversalArray = new Array<T>();

    // add the node to first item of the stack?
    // let currentNode = this.root;
    stack.push(node);

    while (stack.length > 0) {
      // 1. pop the node from the stack?
      // node = stack.pop();

      // 2. add the value into the preOrderTraversalArray
      preOrderTraversalArray.push(node.data);

      // 3. if node has right child, add to stack
      if (node.rightNode !== null) {
        stack.push(node.rightNode);
      }

      // 4. if node has left child, add to stack after adding the right node - Stack is First in Last Out
      if (node.leftNode !== null) {
        stack.push(node.leftNode);
      }
    }

    if (node) {
      console.log(node.data);
      this.preOrderTraversal(node.leftNode);
      this.preOrderTraversal(node.rightNode);
    }

    // 5. return array
    return;
    // return preOrderTraversalArray
  }

  // left - right - root
  postOrderTraversal(node: BinarySearchTreeNode<T> | undefined): void {
    let stack = new Array<BinarySearchTreeNode<T>>();
    let postOrderTraversalArray = new Array<T>();
    stack.push(node);

    while (stack.length > 0) {
      if (node.leftNode !== null) {
        stack.push(node.leftNode);
      }

      if (node.rightNode !== null) {
        stack.push(node.rightNode);
      }

      postOrderTraversalArray.push(node.data);
    }

    if (node) {
      this.postOrderTraversal(node.leftNode);
      this.postOrderTraversal(node.rightNode);
      console.log(node.data);
    }

    return;
  }
}

function comparator(a: number, b: number) {
  if (a < b) return -1;

  if (a > b) return 1;

  return 0;
}
