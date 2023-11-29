CREATE TABLE expense (
   id serial primary key,
   expense text not null,
   amount numeric not null, 
   total numeric not null,  
   category_id int not null,
   foreign key (category_id) references categories(id)
);

CREATE TABLE Categories (
    ID serial primary key, 
    Category_Type text NOT NULL
);
