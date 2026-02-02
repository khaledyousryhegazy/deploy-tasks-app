import React, { Fragment, useState } from "react";

const InputTodo = ({ setUpdateTrigger }) => {
  // ملاحظة: لو عندك function بتجيب الداتا في الـ Parent، مررها هنا عشان تناديها
  const [description, setDescription] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!description) return; // عشان ميضيفش task فاضية

    try {
      const body = { description };
      const response = await fetch("/api/TodoTraverse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        // بديل الـ window.location هو إننا نفضي الـ input
        setDescription("");

        // لو عندك list في صفحة تانية، الأفضل تستخدم state عشان تعمل refresh
        // حالياً، لو عملت refresh يدوي هتلاقيها ظهرت، بس الحركة دي بتمنع الـ Reload الإجباري
        alert("Task Added Successfully!");

        // نصيحة: لو عندك function بتعمل fetch للـ tasks، ناديها هنا:
        // getTodos();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5 display-12">Task Traverser</h1>
      <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          placeholder="Add a new task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-success ml-2">Add</button>
      </form>
    </Fragment>
  );
};

export default InputTodo;
