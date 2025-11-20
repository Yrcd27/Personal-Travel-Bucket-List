-- Sample destinations for all users
INSERT INTO destinations (user_id, destination, country, notes, priority, visited) VALUES
-- Arya Stark destinations
(1, 'Braavos', 'Essos', 'Learn from the Faceless Men', 'high', TRUE),
(1, 'Kings Landing', 'Westeros', 'Unfinished business', 'high', TRUE),
(1, 'Winterfell', 'Westeros', 'Home sweet home', 'medium', TRUE),

-- Daenerys Targaryen destinations
(2, 'Meereen', 'Essos', 'Rule as Queen', 'high', TRUE),
(2, 'Vaes Dothrak', 'Essos', 'Sacred city of the Dothraki', 'medium', TRUE),
(2, 'Kings Landing', 'Westeros', 'Claim the Iron Throne', 'high', FALSE),

-- Tyrion Lannister destinations
(3, 'Pentos', 'Essos', 'Exile adventures', 'medium', TRUE),
(3, 'Meereen', 'Essos', 'Advise the Dragon Queen', 'high', TRUE),
(3, 'Casterly Rock', 'Westeros', 'Family seat', 'low', FALSE),

-- Cersei Lannister destinations
(4, 'Kings Landing', 'Westeros', 'Rule from the Red Keep', 'high', TRUE),
(4, 'Casterly Rock', 'Westeros', 'Lannister stronghold', 'medium', FALSE),
(4, 'Highgarden', 'Westeros', 'Conquer the Reach', 'high', FALSE),

-- Jaime Lannister destinations
(5, 'Riverrun', 'Westeros', 'Siege the castle', 'medium', TRUE),
(5, 'Winterfell', 'Westeros', 'Fight the dead', 'high', TRUE),
(5, 'Kings Landing', 'Westeros', 'Protect the innocent', 'high', TRUE),

-- Brienne of Tarth destinations
(6, 'Tarth', 'Westeros', 'Sapphire Isle home', 'low', FALSE),
(6, 'Winterfell', 'Westeros', 'Serve House Stark', 'high', TRUE),
(6, 'Kings Landing', 'Westeros', 'Protect the royal family', 'medium', TRUE),

-- Sandor Clegane destinations
(7, 'Kings Landing', 'Westeros', 'Serve as Kingsguard', 'medium', TRUE),
(7, 'Winterfell', 'Westeros', 'Fight the dead', 'high', TRUE),
(7, 'The Quiet Isle', 'Westeros', 'Find peace', 'low', FALSE),

-- Gregor Clegane destinations
(8, 'Kings Landing', 'Westeros', 'Serve as the Mountain', 'high', TRUE),
(8, 'Harrenhal', 'Westeros', 'Terrorize prisoners', 'medium', TRUE),
(8, 'Casterly Rock', 'Westeros', 'Lannister service', 'low', FALSE),

-- Jorah Mormont destinations
(9, 'Bear Island', 'Westeros', 'Family home', 'medium', FALSE),
(9, 'Vaes Dothrak', 'Essos', 'Follow Daenerys', 'high', TRUE),
(9, 'Meereen', 'Essos', 'Serve the Queen', 'high', TRUE),

-- Margaery Tyrell destinations
(10, 'Highgarden', 'Westeros', 'House Tyrell seat', 'medium', TRUE),
(10, 'Kings Landing', 'Westeros', 'Become Queen', 'high', TRUE),
(10, 'Oldtown', 'Westeros', 'Visit the Citadel', 'low', FALSE),

-- Oberyn Martell destinations
(11, 'Sunspear', 'Westeros', 'Dornish capital', 'medium', TRUE),
(11, 'Kings Landing', 'Westeros', 'Seek justice for Elia', 'high', TRUE),
(11, 'Oldtown', 'Westeros', 'Study at the Citadel', 'low', TRUE),

-- Ellaria Sand destinations
(12, 'Sunspear', 'Westeros', 'Rule Dorne', 'high', TRUE),
(12, 'Kings Landing', 'Westeros', 'Revenge against Lannisters', 'high', TRUE),
(12, 'Water Gardens', 'Westeros', 'Peaceful retreat', 'low', FALSE),

-- Theon Greyjoy destinations
(13, 'Pyke', 'Westeros', 'Iron Islands home', 'medium', TRUE),
(13, 'Winterfell', 'Westeros', 'Redemption with Starks', 'high', TRUE),
(13, 'Kings Landing', 'Westeros', 'Rescue Yara', 'high', TRUE),

-- Yara Greyjoy destinations
(14, 'Pyke', 'Westeros', 'Rule the Iron Islands', 'high', TRUE),
(14, 'Meereen', 'Essos', 'Alliance with Daenerys', 'medium', TRUE),
(14, 'Kings Landing', 'Westeros', 'Support the Dragon Queen', 'high', FALSE),

-- Stannis Baratheon destinations
(15, 'Dragonstone', 'Westeros', 'Rightful seat', 'high', TRUE),
(15, 'Winterfell', 'Westeros', 'March on the North', 'high', TRUE),
(15, 'Kings Landing', 'Westeros', 'Claim the Iron Throne', 'high', FALSE),

-- Davos Seaworth destinations
(16, 'Dragonstone', 'Westeros', 'Serve Stannis', 'high', TRUE),
(16, 'White Harbor', 'Westeros', 'Smuggling routes', 'medium', TRUE),
(16, 'Winterfell', 'Westeros', 'Serve Jon Snow', 'high', TRUE),

-- Melisandre destinations
(17, 'Asshai', 'Essos', 'Shadow Lands origin', 'medium', FALSE),
(17, 'Dragonstone', 'Westeros', 'Serve the Lord of Light', 'high', TRUE),
(17, 'Winterfell', 'Westeros', 'Fight the darkness', 'high', TRUE),

-- Khal Drogo destinations
(18, 'Vaes Dothrak', 'Essos', 'Sacred Dothraki city', 'high', TRUE),
(18, 'Pentos', 'Essos', 'Meet Daenerys', 'high', TRUE),
(18, 'Lhazar', 'Essos', 'Dothraki raids', 'medium', TRUE),

-- Tormund Giantsbane destinations
(19, 'Beyond the Wall', 'Westeros', 'Free Folk territory', 'high', TRUE),
(19, 'Winterfell', 'Westeros', 'Alliance with Jon Snow', 'high', TRUE),
(19, 'Kings Landing', 'Westeros', 'Fight the dead', 'medium', TRUE),

-- Bronn destinations
(20, 'Kings Landing', 'Westeros', 'Sellsword work', 'medium', TRUE),
(20, 'Highgarden', 'Westeros', 'Lord of the Reach', 'high', FALSE),
(20, 'Stokeworth', 'Westeros', 'Promised lordship', 'low', FALSE);