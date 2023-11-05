# SavePromise

SavePromise is a very small library that allows you to handle saving of data in a promise-like way.
If you have json data you want to save and it is modified, saved and modified again (so you would save it again), you could probably have two save operations at the same time. This library allows you to handle this situation. You can save your data and if it is already saving, it waits for the first save to finish and then saves the data again. It also schudules only one save operation if you save your data multiple times in a short period of time, so you don't have to worry about saving your data too often.

## Installation

```bash
npm install savepromise
```

## Usage

```javascript
import SavePromise from "savepromise";

const savePromise = SavePromise(() => {
  // function that saves your data
});

//save using:
savePromise.save(data);
```

In the above example, the data is saved only once. If you are saving your data multiple times in a short period of time, the true power of this library comes to light. If you save your data multiple times, it is saved only once. If you save your data again, it is saved again after the first save is finished.
So it will optimize your saving operations.

So if you have this code:

```javascript
import SavePromise from "savepromise";

const savePromise = SavePromise(() => {
  // function that saves your data
});

//save using:
savePromise.save(data);
// modify data
savePromise.save(data);
// modify data
savePromise.save(data);
// modify data
savePromise.save(data);
// modify data
savePromise.save(data);
```

there will only be two save operations.
