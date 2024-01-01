function randomIntFromInterval(min,max){
  return Math.floor(Math.random() * (max-min+1) + min)
}

function reverseLinkedList(head) {
  let previous = null
  let current = head
  let temp = null
  while (current!= null){
      temp = current.next
      current.next = previous
      previous = current
      current = temp
  }
  return previous
}
module.exports = { randomIntFromInterval, reverseLinkedList};
