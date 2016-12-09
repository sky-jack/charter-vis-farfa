
#<!-- [.[] | {person_id: .person_id, relation_id: .relation_id[] }]
#// more ./data/json/agent-table2.json | jq '[.[] | {person_id: .person_id, relation_id: .relation_id[] }]' > test.json
# //more ./data/json/agent-table2.json | jq '{ nodes: . , links: [.[] | {source: .person_id, target: .relation_id[] }]}' >  test.json
#// more ./data/json/agent-table2.json | jq '{ nodes: [.[] | {id: .person_id, name: .name }], links: [.[] | {person_id: .person_id, relation_id: .relation_id[] }]}' >  test.json
# //more ./data/json/agent-table2.json | jq '{ nodes: [.[] | {id: .person_id | tostring , name: .name }], links: [.[] | {source: .person_id | tostring, target: .relation_id[] | tostring,  }]}' >  test.json
#{ nodes: [.[] | {id: .person_id | tostring , name: .name }], links: [.[] | {source: .person_id | tostring, target: .relation_id[] | tostring,  }]}

#{ location_nodes: [ .places  ], location_people_link: [ .charters[] | {source: .locations_mentions , target: .granter}]}


{ charters:  .charters,    agents:   .agents ,   locations:  [ .locations[] | select(.coordinates ) |  {id: .id, location_name: .location_name,  coordinates:  .coordinates | split(", ") | reverse  }]}
