'use client';
import {Fragment} from 'react';
import ReactSelect, {GroupBase, Props} from 'react-select';

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
      <ReactSelect id={props.id ?? props.name} {...props} />
    </Fragment>
  );
}
