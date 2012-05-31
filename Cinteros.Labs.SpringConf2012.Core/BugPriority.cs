using System.Runtime.Serialization;

namespace Cinteros.Labs.SpringConf2012 {
    [DataContract(Name = "bugPriority")]
    public class BugPriority {
        static BugPriority() {
            Low = new BugPriority { Index = 0, Title = "Low", Multiplier = 0.8 };
            Normal = new BugPriority { Index = 1, Title = "Normal", Multiplier = 1 };
            High = new BugPriority { Index = 2, Title = "High", Multiplier = 2 };
            Critial = new BugPriority { Index = 3, Title = "Critial", Multiplier = 3 };
        }

        private BugPriority() {

        }

        [DataMember(Name = "index")]
        public int Index { get; private set; }
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