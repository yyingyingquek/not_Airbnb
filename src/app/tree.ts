export class BinarySearchTreeNode<T> {
  data: T;
  leftNode?: BinarySearchTreeNode<T>;
  rightNode?: BinarySearchTreeNode<T>;

  height: number = 1;

  constructor(data: T) {
    this.data = data;
  }

  get leftHeight(): number {
    if (this.leftNode == null) {
      return 0;
    }
    return this.leftNode.height;
  }

  get rightHeight(): number {
    if (this.rightNode == null) {
      return 0;
    }
    return this.rightNode.height;
  }

  // getHeight(node: BinarySearchTreeNode<T>) {
  //   return node == null ? -1 : node.height;
  // }

  // getHeight() {
  //   return this.height - 1;
  // }

  balanceFactor() {
    return this.leftHeight - this.rightHeight;
  }

  updateHeight() {
    this.height = 1 + Math.max(this.leftHeight, this.rightHeight);
  }
}

export class BinarySearchTree<T> {
  root?: BinarySearchTreeNode<T>;
  comparator: (a: T, b: T) => number;

  // constructor(comparator: (a: T, b: T) => number) {
  //   this.comparator = comparator;
  // }

  constructor() {}

  selfBalancingTree(node: BinarySearchTreeNode<T>, key: T) {
    // if -1: more on right so do left rotate
    // if 0: do nothing
    // if 1: more on left so do right rotate

    const balanceFactorOfNode = node.balanceFactor();

    // 1. left left case - do right rotate
    if (balanceFactorOfNode > 1 && key < node.leftNode.data) {
      return this.rightRotate(node);
    }
    // 2. right right case - do left rotate
    if (balanceFactorOfNode < -1 && key > node.rightNode.data) {
      return this.leftRotate(node);
    }
    // 3. left right case - do left then right rotate
    if (balanceFactorOfNode > 1 && key > node.leftNode.data) {
      node.leftNode = this.leftRotate(node.leftNode);
      return this.rightRotate(node);
    }
    // 4. right left case - do right then left rotate
    if (balanceFactorOfNode < -1 && key < node.rightNode.data) {
      node.rightNode = this.rightRotate(node.rightNode);
      return this.leftRotate(node);
    }
    return node;
  }

  leftRotate(node: BinarySearchTreeNode<T>) {
    let y = node.rightNode; // save right subtree of node passed in
    let yLeftChild = y.leftNode; // save left child of the node
    y.leftNode = node; // swap the left child
    node.rightNode = yLeftChild; // set the node at the right to be the yLeftChild

    node.updateHeight();
    y.updateHeight();

    return y;
  }

  rightRotate(node: BinarySearchTreeNode<T>) {
    let y = node.leftNode; // save the left subtree of node passed in
    let yRightChild = y.rightNode; // save the right child of the node
    y.rightNode = node; // swap the right child
    node.leftNode = yRightChild; // set the node at the left to be yRightChild

    node.updateHeight();
    y.updateHeight();

    return y;
  }

  insert(data: T, key: T): BinarySearchTreeNode<T> | undefined {
    const newNode = new BinarySearchTreeNode(data);
    if (!this.root) {
      this.root = newNode;
      return newNode;
    }

    if (this.root) {
      let currentNode = this.root;
      let searchingForPosition = true;
      currentNode.updateHeight();

      let searchForDuplicate = this.search(data);
      if (searchForDuplicate) {
        searchingForPosition = false;
        throw new Error('data already exists');
      }

      while (searchingForPosition) {
        if (currentNode.data > newNode.data) {
          if (currentNode.leftNode == null) {
            currentNode.leftNode = newNode;
            currentNode.updateHeight();
            searchingForPosition = false;
            this.selfBalancingTree(currentNode, key);
            return this.selfBalancingTree(newNode, key);
          } else {
            currentNode = currentNode.leftNode;
            currentNode.updateHeight();
            this.selfBalancingTree(currentNode, key);
          }
        } else if (currentNode.data < data) {
          if (currentNode.rightNode == null) {
            currentNode.rightNode = newNode;
            currentNode.updateHeight();
            searchingForPosition = false;
            this.selfBalancingTree(currentNode, key);
            return this.selfBalancingTree(newNode, key);
          } else {
            currentNode = currentNode.rightNode;
            currentNode.updateHeight();
            this.selfBalancingTree(currentNode, key);
          }
        }
      }
    }

    // if (this.root == undefined || null) {
    //   return new BinarySearchTreeNode(key);
    // }

    // if (key < data.data) {
    //   data.leftNode = this.insert(data, key);
    // } else if (key > data.data) {
    //   data.rightNode = this.insert(data, key);
    // } else {
    //   return data;
    // }
    return this.selfBalancingTree(newNode, key);
  }

  search(data: T): BinarySearchTreeNode<T> | undefined {
    if (!this.root) {
      return null;
    }

    let currentNode = this.root;

    while (currentNode) {
      if (currentNode.data == data) {
        return currentNode;
      }

      if (currentNode.data > data) {
        if (!currentNode.leftNode) {
          return;
        }
        currentNode = currentNode.leftNode;
      } else {
        if (!currentNode.rightNode) {
          return;
        }
        currentNode = currentNode.rightNode;
      }
    }

    return currentNode;
  }

  inOrderTraversal(node: BinarySearchTreeNode<T> | undefined): void {
    if (node) {
      this.inOrderTraversal(node.leftNode);
      console.log(node.data);
      this.inOrderTraversal(node.rightNode);
    }
    return;
  }

  preOrderTraversal(node: BinarySearchTreeNode<T> | undefined): void {
    if (node) {
      console.log(node);
      this.preOrderTraversal(node.leftNode);
      this.preOrderTraversal(node.rightNode);
    }
    return;
  }

  postOrderTraversal(node: BinarySearchTreeNode<T> | undefined): void {
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

let tree = new BinarySearchTree();
tree.insert(8, 8);
tree.insert(5, 5);
tree.insert(3, 3);
tree.insert(6, 6);
tree.insert(9, 9);
tree.insert(10, 10);

// const inserts: number[] = [8, 5, 3, 6, 9, 10];
// for (const i of inserts) {
//   tree.root = tree.insert(tree.root, i);
// }

// console.log(tree);
console.log('working tree', JSON.stringify(tree));

// tree.insert(3, 3);
// console.log("duplicate tree", JSON.stringify(tree));

let testTree2 = new BinarySearchTree();
// const inserts2: number[] = [10, 5, 15, -10, -5];
// for (const i of inserts2) {
//   testTree2.root = testTree2.insert(testTree2.root, i);
// }
testTree2.insert(10, 10);
testTree2.insert(5, 5);
testTree2.insert(-5, -5);
testTree2.insert(15, 15);
testTree2.insert(-10, -10);
console.log(testTree2);
console.log('tree2', JSON.stringify(testTree2));

// console.log(tree.search(2));
// console.log(tree.search(5));
// console.log(tree.search(10));

// tree.inOrderTraversal(tree.root);
// tree.preOrderTraversal(tree.root);
// tree.postOrderTraversal(tree.root);
