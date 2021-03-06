import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>Meetups React</title>
        <meta
          name="description"
          content="Browse a huge list of highly active react meetups!"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

/*export async function getServerSideProps(context) {
  const req=context.req;
  const res=context.res;
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    }
  };
}*/

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://ahmed:Medo741123@cluster0.j6tu1.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  client.close();
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
