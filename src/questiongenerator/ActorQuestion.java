package questiongenerator;

public class ActorQuestion extends Question{
	
	public ActorQuestion(){
		super();
		request = 	"prefix db-owl: <http://dbpedia.org/ontology/>"
					+"prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
					+ "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
					+ "PREFIX dbp: <http://dbpedia.org/property/>"
					+ "PREFIX umbel-rc: <http://umbel.org/umbel/rc/>"
					+ "select distinct (str(?name) as ?n) (str(?country) as ?cnt) (str(?birthYear) as ?date) where {"
					+ "?actor a umbel-rc:Actor;"
					+ "foaf:name ?name;"
					+ "db-owl:birthPlace ?birthPlace;"
					+ "db-owl:birthYear ?birthYear."
					+ "?birthPlace dbp:commonName ?country."
					+ "FILTER regex(?name, '^((?![éàè,íó]).)*$')"
					+ "}"
					+ "limit 10"
					+ "offset "
					+ Integer.toString(offset_rand);
	}
}
