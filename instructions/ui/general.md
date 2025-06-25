# UI Composition Instructions

Favor declarative composition and avoid soul crushing props. 

### Do 
```
<a-list>
	<a-list-item>1</a-list-item>
	<a-list-item>2</a-list-item>
	<a-list-item>3</a-list-item>
</a-list>
```

### Don't
```
<a-list items=[{},{}[{}]]></a-list-item>
```