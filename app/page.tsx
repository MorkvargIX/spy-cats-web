"use client";

import { useEffect, useState } from "react";

const API_URL = 'http://127.0.0.1:8000'

type Cat = {
  id: number;
  name: string;
  years_of_experience: number;
  breed: string;
  salary: number;
};

export default function Home() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    years_of_experience: "",
    breed: "",
    salary: "",
  });

  const extractErrorMessage = (err: any): string => {
    if (!err) return "Unknown error";

    if (typeof err === "string") return err;

    if (Array.isArray(err)) {
      return err.map((e) => e.msg).join(", ");
    }

    if (typeof err === "object") {
      if (Array.isArray(err.detail)) {
        return err.detail.map((e: any) => e.msg).join(", ");
      }
      if (typeof err.detail === "string") {
        return err.detail;
      }
    }

    return "Unexpected error";
  };

  const extractFieldErrors = (err: any): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (Array.isArray(err?.detail)) {
      err.detail.forEach((e: any) => {
        const field = e.loc?.[1];
        if (field) {
          errors[field] = e.msg;
        }
      });
    }

    return errors;
  };

  const loadCats = async () => {
    const res = await fetch("http://127.0.0.1:8000/cats");
    const data = await res.json();
    setCats(data);
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(""), 4000);
  };


  useEffect(() => {
    loadCats();
  }, []);

  const createCat = async () => {
    setError("");
    setFieldErrors({});

    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = "Name is required";
    }

    if (!form.breed.trim()) {
      errors.breed = "Breed is required";
    }

    if (!form.salary || Number(form.salary) <= 0) {
      errors.salary = "Salary must be greater than 0";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    const res = await fetch("http://127.0.0.1:8000/cats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        years_of_experience: Number(form.years_of_experience),
        breed: form.breed,
        salary: Number(form.salary),
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      const apiError = extractFieldErrors(err);

      if (Object.keys(apiError).length > 0) {
        setFieldErrors(apiError);
      } else {
        showError(extractErrorMessage(err));
      }
      return;
    }

    showSuccess("Cat successfully created");

    setForm({ name: "", years_of_experience: "", breed: "", salary: "" });
    loadCats();
  };

  const deleteCat = async (id: number) => {
    const res = await fetch(`${API_URL}/cats/${id}`, { method: "DELETE" });

    if (!res.ok) {
      showError("Failed to delete cat");
      return;
    }

    showSuccess("Cat deleted");
    loadCats();
  };

  const updateSalary = async (id: number, salary: number) => {
    const res = await fetch(`${API_URL}/cats/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salary }),
    });

    if (!res.ok) {
      showError("Failed to update salary");
      return;
    }

    showSuccess("Salary updated");
    loadCats();
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {success && (
        <div className="mb-4 rounded bg-green-100 text-green-800 px-4 py-2">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded bg-red-100 text-red-800 px-4 py-2">
          {error}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Spy Cats Dashboard</h1>

      {/* Create form */}
      <div className="space-y-2 mb-6">
        <input
          className={`border p-2 w-full ${
            fieldErrors.name ? "border-red-500" : ""
          }`}
          placeholder="Name"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            setFieldErrors((prev) => ({ ...prev, name: "" }));
          }}
        />
        {fieldErrors.name && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>
        )}

        <input
          type="number"
          className={`border p-2 w-full ${
            fieldErrors.years_of_experience ? "border-red-500" : ""
          }`}
          placeholder="Years of experience"
          value={form.years_of_experience}
          onChange={(e) => {
            setForm({ ...form, years_of_experience: e.target.value });
            setFieldErrors((prev) => ({ ...prev, years_of_experience: "" }));
          }}
        />
        {fieldErrors.years_of_experience && (
          <p className="text-sm text-red-600 mt-1">
            {fieldErrors.years_of_experience}
          </p>
        )}

        <input
          className={`border p-2 w-full ${
            fieldErrors.breed ? "border-red-500" : ""
          }`}
          placeholder="Breed"
          value={form.breed}
          onChange={(e) => {
            setForm({ ...form, breed: e.target.value });
            setFieldErrors((prev) => ({ ...prev, breed: "" }));
          }}
        />
        {fieldErrors.breed && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.breed}</p>
        )}

        <input
          type="number"
          className={`border p-2 w-full ${
            fieldErrors.salary ? "border-red-500" : ""
          }`}
          placeholder="Salary"
          value={form.salary}
          onChange={(e) => {
            setForm({ ...form, salary: e.target.value });
            setFieldErrors((prev) => ({ ...prev, salary: "" }));
          }}
        />
        {fieldErrors.salary && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.salary}</p>
        )}

        <button
          onClick={createCat}
          className="bg-black text-white px-4 py-2"
        >
          Add Cat
        </button>
      </div>

      {/* List */}
     <ul className="space-y-3">
        {cats.map((cat) => (
          <li key={cat.id} className="border p-3 rounded">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="font-semibold">
                  {cat.name} <span className="text-sm text-gray-500">({cat.breed})</span>
                </div>
                <div className="text-sm text-gray-600">
                  Experience: {cat.years_of_experience} years
                </div>
              </div>

              {/* Salary input */}
              <input
                type="number"
                className="border p-1 w-24 text-right"
                value={cat.salary}
                onChange={(e) =>
                  setCats((prev) =>
                    prev.map((c) =>
                      c.id === cat.id
                        ? { ...c, salary: Number(e.target.value) }
                        : c
                    )
                  )
                }
              />

              {/* Save salary */}
              <button
                onClick={() => updateSalary(cat.id, cat.salary)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Save
              </button>

              {/* Delete */}
              <button
                className="text-red-600 text-sm"
                onClick={() => deleteCat(cat.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
