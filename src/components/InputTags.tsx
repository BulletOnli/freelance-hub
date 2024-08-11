"use client ";
import debounce from "@/utils/debounce";
import { X } from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";

const COURSES = [
  "Programming Fundamentals",
  "Web Development",
  "Data Science and Machine Learning",
  "Cybersecurity",
  "Mobile App Development",
  "Cloud Computing",
  "Database Management ",
  "IT Project Management",
  "Business Planning and Strategy",
  "Marketing and Digital Marketing",
  "Financial Management",
  "Start-up Fundamentals",
  "E-commerce and Online Retail",
  "Business Ethics and Sustainability",
  "Leadership and Management",
  "Graphic Design",
  "Video Editing and Production",
  "Photography",
  "Creative Writing",
  "Music Composition and Production",
  "3D Modeling and Animation",
  "UI/UX Design",
];

type Props = {
  form?: any;
};

const InputTags = ({ form }: Props) => {
  const [tags, setTags] = useState<string[]>([]);

  // useEffect(() => {
  //   setTags(form.getValues("specialization") || []);
  // }, []);

  const handleSelectTag = (e: ChangeEvent<HTMLSelectElement>) => {
    const newTag = e.target.value;

    if (tags.includes(newTag)) {
      console.log("Tag already exist");
      return;
    }

    if (tags.length !== 5) {
      setTags([...tags, newTag]);
      form.setValue("specialization", [...tags, newTag]);
    } else {
      console.log("max of 5");
    }
  };

  const handleDebouncedSelectTag = debounce(handleSelectTag, 200);

  const handleDeleteTag = (value: string) => {
    const updatedTags = tags.filter((tag) => tag !== value);
    setTags(updatedTags);
    form.setValue("specialization", updatedTags);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <select
        onChange={handleDebouncedSelectTag}
        className="w-full px-4 text-sm py-2 outline-none border border-slate-200 rounded-md"
      >
        <option value={undefined} disabled>
          Expertise and Specialization
        </option>
        {COURSES.map((course) => (
          <option key={course} value={course}>
            {course}
          </option>
        ))}
      </select>

      {tags?.length !== 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {tags?.map((tag) => (
            <div
              key={tag}
              className="flex text-sm items-center gap-2 px-2 py-1 rounded-full border border-slate-200"
            >
              <p>{tag}</p>

              <X
                className="size-4 cursor-pointer"
                onClick={() => handleDeleteTag(tag)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputTags;
