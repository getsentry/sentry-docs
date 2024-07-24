'use client';
import {Fragment} from 'react';
import {GroupBase, Props} from 'react-select';
import CreatableSelect from 'react-select/creatable';

export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group> & {label: string}) {
  return (
    <Fragment>
      <label
        htmlFor={props.id ?? props.name}
        className="block text-xs font-medium text-gray-700"
      >
        {props.label}
        {props.required && (
          <Fragment>
            &nbsp;<span className="font-bold text-secondary">*</span>
          </Fragment>
        )}
      </label>
      <CreatableSelect id={props.id ?? props.name} {...props} />
    </Fragment>
  );
}
