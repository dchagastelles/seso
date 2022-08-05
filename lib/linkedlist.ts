import { Console } from "console";

export interface LogValue {
    date: Date,
    msg: string,
    index?: number
  }

export class Node {
    public value: LogValue | null;
    public next: Node | null;
  
    constructor(value: LogValue | null) {
      this.value = value;
      this.next = null;
    }
  }
  
 export class LinkedList {
    public head: Node | null;
    public tail: Node | null;
    public length: number;
  
    constructor(value: LogValue | null) {
      if (value === null || value === undefined) {
        this.head = null;
        this.tail = null;
        this.length = 0;
  
        return;
      }
  
      const node: Node = new Node(value);
  
      this.head = node;
      this.tail = node;
      this.length = 1;
    }
  
    public append(value: LogValue | null): Node {
      const node: Node = new Node(value);
  
      if (!this.length) {
        this.head = node;
        this.tail = node;
      } else {
        (this.tail as Node).next = node;
        this.tail = node;
      }
  
      this.length++;
  
      return node;
    }
  
    public prepend(value: LogValue | null): Node {
      const node: Node = new Node(value);
  
      if (!this.length) {
        this.tail = node;
      } else {
        node.next = this.head;
      }
  
      this.head = node;
      this.length++;
  
      return node;
    }
  
    public pop(): Node | undefined {
      if (!this.head) return undefined;
  
      let temp: Node = this.head;
      let pre: Node = this.head;
  
      while (temp.next) {
        pre = temp;
        temp = temp.next;
      }
  
      this.tail = pre;
      this.tail.next = null;
      this.length--;
  
      if (!this.length) {
        this.head = null;
        this.tail = null;
      }
  
      return temp;
    }
  
    public popHead(): Node | undefined {
        if (!this.head) return undefined;
    
        let temp: Node = this.head;
        this.head = temp.next;
    
        this.length--;
    
        // if (!this.length) {
        //   this.head = null;
        //   this.tail = null;
        // }
    
        return temp;
      }


    public get(index: number): Node | null {
      if (index < 0 || index >= this.length) return null;
  
      let node: Node | null = this.head;
  
      for (let i = 0; i < index; i++) {
        node = (node as Node).next;
      }
  
      return node;
    }
  
   
    public insert(index: number, value: LogValue | null): Node | undefined {
      if (!index) return this.prepend(value);
      if (index === this.length) return this.append(value);
      if (index < 0 || index > this.length) return;
  
      const newNode: Node = new Node(value);
      const temp: Node | null = this.get(index - 1);
  
      newNode.next = (temp as Node).next;
      (temp as Node).next = newNode;
  
      this.length++;
  
      return newNode;
    }

    public add(value: LogValue): Node | undefined {
        let poppedValueDate = value.date;

        if (this.head === undefined || this.head?.value === undefined) {
            return;
        }
        let headValueDate = (this.head?.value as LogValue).date;
        let tailValueDate = (this.tail?.value as LogValue).date;
        if (poppedValueDate <= headValueDate){
            return this.prepend(value);    
          } else if (poppedValueDate >= tailValueDate){
            return this.append(value);
          } else {
            return this.insertInOrder(value);
          }
           
    }

    public insertInOrder(value: LogValue | null): Node | undefined {
    
        const newNode: Node = new Node(value);
        let temp: Node | null = this.head;

        for (let i = 0; i < this.length; i++) {
            if ((value as LogValue).date >= ((temp as Node).value as LogValue).date && (value as LogValue).date < ((temp as Node).next?.value as LogValue).date){
                newNode.next = (temp as Node).next;
                (temp as Node).next = newNode;
                this.length++;
                return;
            } else {
                temp = (temp as Node).next;
            }
        }
    
    
        return newNode;
      }

 
  
   
  }