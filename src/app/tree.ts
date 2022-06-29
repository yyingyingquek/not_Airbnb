export class BinarySearchTreeNode<T> {
  data: T;
  leftNode?: BinarySearchTreeNode<T>;
  rightNode?: BinarySearchTreeNode<T>;

  height: number = 1;

  constructor(data: T) {
    this.data = data;
  }

  get leftHeight(): number {
    if (!this.leftNode) {
      return 0;
    }
    return this.leftNode.height;
  }

  get rightHeight(): number {
    if (!this.rightNode) {
      return 0;
    }
    return this.rightNode.height;
  }

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
    // console.log("key", key);
    // console.log("node", node);

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

  insert(
    node: BinarySearchTreeNode<T>,
    key: T
  ): BinarySearchTreeNode<T> | undefined {
    if (!node) {
      return new BinarySearchTreeNode(key);
    }

    let searchForDuplicate = this.search(node, key);
    if (searchForDuplicate) {
      throw new Error('node exists');
    }

    if (key < node.data) {
      node.leftNode = this.insert(node.leftNode, key);
    } else if (key > node.data) {
      node.rightNode = this.insert(node.rightNode, key);
    } else {
      return node;
    }

    node.updateHeight();
    return this.selfBalancingTree(node, key);
  }

  search(
    node: BinarySearchTreeNode<T>,
    key: T
  ): BinarySearchTreeNode<T> | boolean {
    if (!node) {
      return false;
    }

    if (key < node.data) {
      return this.search(node.leftNode, key);
    } else if (key > node.data) {
      return this.search(node.rightNode, key);
    } else {
      return true;
    }
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

let testTree2 = new BinarySearchTree();
const inserts2: number[] = [1, 2, 3, 4, 5];
for (const i of inserts2) {
  testTree2.root = testTree2.insert(testTree2.root, i);
}

console.log('tree2', JSON.stringify(testTree2));
console.log('search', testTree2.search(testTree2.root, 5));
console.log('search', testTree2.search(testTree2.root, 10));

testTree2.inOrderTraversal(testTree2.root);
testTree2.preOrderTraversal(testTree2.root);
testTree2.postOrderTraversal(testTree2.root);
