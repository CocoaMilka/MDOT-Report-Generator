# MoDOT-Report-Generator

A webpage proof of concept to show the possibility of filling out MoDOT forms from data generated in ARBI. (AR Bridge Inspection)

## Current Functionality

* Read and process JSON files uploaded by user
* Populate tables from JSON file
* Save filled out forms as PDF

**NOTE:** Currently the Report Generator is only capable of filling out the substructure portion of the report for demo purposes, check releases for more information.

## ToDo

* Restructure to create tables and populate as data is processed rather than hardcoding tables. Allows for more flexibility to accomodate multiple standards from each state
* Clean up table formatting (CSS)
* Add functionality for all table sections

## Background

ARBI is an AR bridge inspection software for the Hololens 2, developed by the INSPIRE research team at Missouri S&T. The software allows users to perform bridge inspections in AR.  This data is then saved into a JSON file which this webpage is designed to read and fill out according to the MoDOT standard.

For more information about ARBI, refer to the ARBI repository...
