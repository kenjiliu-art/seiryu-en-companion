Place
 ├── contains → Living Thing
 ├── contains → Feature
 ├── documented by → Media
 ├── documented by → Document
 ├── associated with → Event

Person
 ├── created → Place
 ├── created → Work
 ├── participated in → Event

Work
 ├── references → Living Thing
 ├── references → Place

Media
 ├── depicts → Place
 ├── depicts → Person
 ├── depicts → Feature