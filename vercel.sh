#!/bin/bash
 
if [[ $VERCEL_ENV == "production"  ]] ; then
  yarn run build
else
  yarn run build:preview
fi