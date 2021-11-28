import { useState, useEffect } from 'react'
import axios from 'axios';

const URL = 'http://localhost/shopping-list/';

function App() {
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0)
  const [editItem, setEditItem] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState(0)

  useEffect(() => {
    axios.get(URL + 'index.php')
      .then((response) => {

        setItems
          (response.data)
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }, [])

  function add(e) {
    e.preventDefault();
    const json = JSON.stringify({ description: description, amount: amount })
    axios.post(URL + 'save.php', json, {
      headers: {
        'Content-Type': 'application/json'
      }

    })
      .then((response) => {
        setItems
          (items => [...items, response.data]);
        setDescription('')
        setAmount('');
      }).catch(error => {
        alert(error.response.data.error)
      })
  }

  function remove(id) {
    const json = JSON.stringify({ id: id })
    axios.post(URL + 'delete.php', json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved)
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }

  function setEdit(item) {
    setEditItem(item);
    setEditDescription(item?.description)
    setEditAmount(item?.amount);
  }

  function update(e) {
    e.preventDefault();
    const json = JSON.stringify({ id: editItem.id, description: editDescription, amount: editAmount })
    axios.post(URL + 'update.php', json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        items[(items.findIndex(item => item.id === editItem.id))].description = editDescription;
        items[(items.findIndex(item => item.id === editItem.id))].amount = editAmount;
        setItems
          ([...items]);
        setEditItem(null);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }

  

  return (
    <div className="container">
      <h3>Shopping list</h3>
      <form onSubmit={add}>
        <label>New item</label>
        <input value={description} placeholder="type product" onChange={e => setDescription(e.target.value)} />
        <input value={amount} placeholder="type amount" onChange={e => setAmount(e.target.value)} />
        <button>Save</button>
      </form>
      <ol>
        {items?.map(item => (
          <li key={item.id}>
            <span className="desc">{editItem?.id !== item.id && 
            item.description}</span>
            <span className="amount">{editItem?.id !== item.id && 
            item.amount} pieces</span>    
            {editItem?.id === item.id &&
              <form onSubmit={update}>
                <input value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                <input value={editAmount} onChange={e => setEditAmount(e.target.value)} />
                <button>Save</button>
                <button type="button" onClick={() => setEdit(null)}>Cancel</button>
              </form>
            }
            <button className="delete" onClick={() => remove(item.id)}>
              Delete
            </button>
            {editItem === null &&
              <button className="edit" onClick={() => setEdit(item)}>
                Edit
              </button>
            }
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;




