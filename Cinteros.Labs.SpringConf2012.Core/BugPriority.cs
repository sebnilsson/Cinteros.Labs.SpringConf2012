using System.Runtime.Serialization;

namespace Cinteros.Labs.SpringConf2012 {
    [DataContract(Name = "bugPriority")]
    public class BugPriority {
        static BugPriority() {
            Low = new BugPriority { ID = 1, Title = "Low", Multiplier = 0.8 };
            Normal = new BugPriority { ID = 2, Title = "Normal", Multiplier = 1 };
            High = new BugPriority { ID = 3, Title = "High", Multiplier = 2 };
            Critial = new BugPriority { ID = 4, Title = "Critial", Multiplier = 3 };
        }

        private BugPriority() {

        }

        [DataMember(Name = "id")]
        public int ID { get; private set; }
        [DataMember(Name = "multiplier")]
        public double Multiplier { get; private set; }
        [DataMember(Name = "title")]
        public string Title { get; private set; }

        public static readonly BugPriority Low;
        public static readonly BugPriority Normal;
        public static readonly BugPriority High;
        public static readonly BugPriority Critial;
    }
}